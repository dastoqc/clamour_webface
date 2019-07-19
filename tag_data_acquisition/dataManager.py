#!/usr/bin/python3

from multiprocessing import Process, Queue, Lock
from dataToBuffer import DataToBuffer
from argumentParser import ArgumentParser
from sys import argv

# Constants for the data management
INDEX_FLAG    = 0
INDEX_CONTENT = 1

FLAG_DATA     = 'd'
FLAG_HEADER   = 'h'
FLAG_INFO     = 'i'
FLAG_END      = 'e'

"""
This class manages the the data acquired throughout the main clamour program. The data, managed
by this class fit into three main categories : data, info

"data"     : This type of data is the main data that is meant to be analysed in the data
             analysis phase of this projet. It consist of localization output optained through
             the clamour system.
"info"     : This type of data is the data that is not used for data analysis, but is important
             for debugging.
"""
class DataManager :

    """ Constructor """
    def __init__(self) :
        self.data_to_manage_queue = Queue()
        self.dataManaging_process = None

    """ Destructor """
    def __del__(self) :
        if not self.dataManaging_process == None :
            self.end()
            self.dataManaging_process.join()

    """ 
    Method to acquire a state vector.
    The data acquired through this method represent the main localization data that is meant to 
    be used for data analysis. Those data are stored in a csv file and transmitted to the tcp 
    server (if connected).
    """
    def get_state_vector_data(self, data) :
        self.data_to_manage_queue.put([FLAG_DATA, data[:]])

    """ 
    Method to acquire information in general.
    The information acquired through this method is meant to be used for debugging purposes.
    """
    def get_information_data(self, data) :
        self.data_to_manage_queue.put([FLAG_INFO, data[:]])
    
    """ 
    Method to start the process.
    The system_arguments expects the python script lauching arguments, i.e. : "sys.argv"
    The pozyx_lock is requiered as the data managing process fetches the I.D of the pozyx in
    order to write the name and the header of the csv file that it generates.
    """
    def start(self, system_arguments="", pozyx_lock=Lock()) :
        self.dataManaging_process = Process(target=self.data_management_method, \
                                            args=((self.data_to_manage_queue), argv, pozyx_lock))
        self.dataManaging_process.start()

    """ Method to end the process. """
    def end(self) :
        self.data_to_manage_queue.put([FLAG_END, None])

    """
    Main method executed in the data management process.
    This method takes the data stored in the data_to_manage_queue and manages it according to
    the flag of each data bundle.
    """
    def data_management_method(self, multiprocessing_queue, system_arguments="", pozyx_lock=Lock()):
        # Variable required for the management of the data
        print('Prints something here for some reason...')
        argument_manager = ArgumentParser(system_arguments)
        argument_manager.manage_arguments()
        data_manager = DataToBuffer()
        queue_element = None
        must_continue = True

        # Data management
        while must_continue :
            if not multiprocessing_queue.empty() :
                queue_element = multiprocessing_queue.get()
                
                if  queue_element[INDEX_FLAG] == FLAG_DATA :
                    data_manager.full_sample_acquisition(queue_element[INDEX_CONTENT])
                
                elif queue_element[INDEX_FLAG] == FLAG_INFO :
                    pass #TODO: Send to tcp server and maybe store in log file.

                elif queue_element[INDEX_FLAG] == FLAG_END :
                    must_continue = False

# Global data manager
data_manager = DataManager()
