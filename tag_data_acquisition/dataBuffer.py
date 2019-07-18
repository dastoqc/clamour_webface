#!/usr/bin/env python

from dataToCsv import CsvWriter
from dataToTcp import TcpSender, TAG_HEADER, TAG_DATA
from staticDataProbe import StaticDataProbe
from json import load

# Parsing data according to the configuration file
with open('config.json') as config_file:
    config = load(config_file)
DATA_BUFFER_MAX_ROWS = config['max_rows']['data_buffer'    ]
SOCKET_MAX_ROWS      = config['max_rows']['socket_transfer']

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
        # Parameters for TCP connection
        self.tcp_sender     = TcpSender() 
        self.tcp_row_cursor = 0
        self.tcp_enabled    = self.tcp_sender.succed_connection()
        
        # Parameters for data buffer
        self.csv_writer     = CsvWriter()
        self.current_row    = []
        self.rows_queue     = []
        self.add_initial_row()

    """
    Destructor
    """
    def __del__(self) :
        self.pour_data_in_csv()

    """
    Adds the initial row of the data acquisition to the rows queue and write the row in
    the csv immediately. The row in question is the following :
    _______________________________________________________________________________
    | ID       | Date (Year-Month-Day)   | Realtime test (False) or Visit (True)  |
    -------------------------------------------------------------------------------
    | 0xXXXX   | YYYY-MM-DD              | False or True                          |
    -------------------------------------------------------------------------------
    """
    def add_initial_row(self) :
        # Grabbing the informations on the tag
        tag_data_getter = StaticDataProbe()
        first_row = tag_data_getter.fetch_first_data_row()
        
        # Sending the data to the csv and tcp server if applicable
        self.rows_queue.append(first_row)
        self.transfer_data_to_tcp_server(tag=TAG_HEADER,reset_cursor=True)
        self.pour_data_in_csv(send_remains_to_tcp=False)
        
    """
    Adds the current row to the rows queue and sets the current now anew
    The expected format of the row once the acquisition is accomplished is the following :
    __________________________________________________________________________________________________________________________________________
    | Time of the day | Time since the beginning | Delta time  | x    | y    | Z    | x speed  | y speed  | z speed  | yaw   | yaw variation |
    ------------------------------------------------------------------------------------------------------------------------------------------
    | hh:mm:ss.mmmmmm | ss.mmmmmm                | ss.mmmmmm   | XXXX | XXXX | XXXX | XXXX     | XXXXX    | XXXX     | XXXXX | XXXX          |
    ------------------------------------------------------------------------------------------------------------------------------------------
    """
    def add_row(self) :
        # Pushes the current row to the rows queue
        self.rows_queue.append(self.current_row[:])
        self.current_row.clear()
        
        # Pours the data in the csv file if the buffer reached the buffer limit
        if len(self.rows_queue) >= DATA_BUFFER_MAX_ROWS :
            self.pour_data_in_csv()

        # Sends the data to the TCP server if a connection was established and
        # if the buffer reached a multiple of the socket transfer limit
        if self.tcp_enabled and (len(self.rows_queue) % SOCKET_MAX_ROWS) == 0 :
            self.transfer_data_to_tcp_server()
        
    """
    Takes an element (time data or localization data) and adds it to the current row
    """
    def take_element(self, element) :
        self.current_row.append(element)

    """
    Transfers the data in the csv file and empties the data buffer.
    Before emptying the data buffer, the remaining data if sent to the
    TCP server if it is asked to.
    """
    def pour_data_in_csv(self, send_remains_to_tcp=True) :
        self.csv_writer.write_list_to_csv(self.rows_queue)
        
        # TCP transfer, if enabled and required
        if send_remains_to_tcp and self.tcp_enabled :
            self.transfer_data_to_tcp_server()
            self.tcp_row_cursor = 0
        
        self.rows_queue.clear()

    """
    Transfers the data to the tcp server
    """
    def transfer_data_to_tcp_server(self, tag=TAG_DATA, reset_cursor=False) :
        for i in range(self.tcp_row_cursor, len(self.rows_queue)) :
            self.tcp_sender.send_data(self.rows_queue[i], tag=tag)
        if reset_cursor :
            self.tcp_row_cursor = 0
        else :
            self.tcp_row_cursor = len(self.rows_queue)
        
# Declaration of a global databuffer to be used by all real-time data probes
global_data_buffer = DataBuffer()