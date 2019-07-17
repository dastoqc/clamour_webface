#!/usr/bin/env python

from dataToCsv import CsvWriter
from dataToTcp import TcpSender
from staticDataProbe import StaticDataProbe

#TODO: CREATE setting file to modify the amount fo data that is inserted
DATA_BUFFER_MAXIMUM_SIZE = 100

"""
One global data rows buffer is instanciated
This global data rows buffer is filled by the help of the different probes
When the data Rows Buffer receives a certain cue, it writes down all of its data in the csv file
"""
class DataBuffer:
    """
    Constructor
    """
    def __init__(self) :
        self.csv_writer  = CsvWriter()
        self.tcp_sender  = TcpSender('127.0.0.1', 3001)
        self.current_row = []
        self.rows_queue  = []
        self.add_initial_row()

    """
    Destructor
    """
    def __del__(self) :
        self.csv_writer.write_list_to_csv(self.rows_queue)

    """
    Adds the initial row of the data acquisition to the rows queue
    ______________________________________
    | ID       | Date (Year-Month-Day)   |
    --------------------------------------
    | 0xXXXX   | YYYY-MM-DD              |
    --------------------------------------
    """
    def add_initial_row(self) :
        tag_data_getter = StaticDataProbe()
        self.rows_queue.append(tag_data_getter.fetch_first_data_row())
        self.transfer_data_to_csv()

    """
    Adds the current row to the rows queue and sets the current now anew
    """
    def add_row(self) :
        self.rows_queue.append(self.current_row[:])
        self.current_row.clear()
        if len(self.rows_queue) >= DATA_BUFFER_MAXIMUM_SIZE :
            self.transfer_data_to_csv()
        
    """
    Takes an element (time data or localization data) and adds it to the current row
    """
    def take_element(self, element) :
        self.current_row.append(element)

    """
    Transfers the data in the csv file and empties the data buffer
    """
    def transfer_data_to_csv(self) :
        self.csv_writer.write_list_to_csv(self.rows_queue)
        self.rows_queue.clear()
        
# Declaration of a global databuffer to be used by all real-time data probes
global_data_buffer = DataBuffer()