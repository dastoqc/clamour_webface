#!/usr/bin/python3

from multiprocessing import Process, Queue
from dataToBuffer import DataToBuffer
import random

INDEX_FLAG    = 0
INDEX_CONTENT = 1

FLAG_DATA   = 'd'
FLAG_HEADER = 'h'
FLAG_INFO   = 'i'
FLAG_END    = 'e'

class DataProbe :

    """ Constructor """
    def __init__(self, pozyx_lock=None) :
        self.data_to_manage_queue = Queue()
        self.dataManaging_process = Process(target=self.data_management_method, \
                                            args=((self.data_to_manage_queue), pozyx_lock))
        self.dataManaging_process.start()

    """ Destructor """
    def __del__(self) :
        self.end()
        self.dataManaging_process.join()

    """ 
    Method to acquire a state vector.
    The data acquired through this method represent the main localization data that is
    meant to be used for data analysis. Those data are stored in a csv file and transmitted 
    to the tcp server (if connected).
    """
    def get_state_vector_data(self, data) :
        self.data_to_manage_queue.put([FLAG_DATA, data[:]])

    """ 
    Method to acquire information in general.
    The information acquired through this method is meant to be used for debugging purposes.
    """
    def get_information_data(self, data) :
        self.data_to_manage_queue.put([FLAG_INFO, data])
    
    """
    Method to end the process.
    """
    def end(self) :
        self.data_to_manage_queue.put([FLAG_END, None])

    """
    Main method executed in the data management process.
    This method takes the data stored in the data_to_manage_queue and manages it according to
    the flag of each data bundle.
    """
    def data_management_method(self, multiprocessing_queue, pozyx_lock=None):
        # Variable required for the management of the data
        dataManager = DataToBuffer()
        queue_element = None
        must_continue = True

        # Data management
        while must_continue :
            if not multiprocessing_queue.empty() :
                queue_element = multiprocessing_queue.get()
                
                if  queue_element[INDEX_FLAG] == FLAG_DATA :
                    dataManager.full_sample_acquisition(queue_element[INDEX_CONTENT])
                
                elif queue_element[INDEX_FLAG] == FLAG_DATA :
                    pass #TODO: Send to tcp server and maybe store in log file.

                elif queue_element[INDEX_FLAG] == FLAG_END :
                    must_continue = False



