#!/usr/bin/env python

from datetime import datetime
from pypozyx import get_first_pozyx_serial_port, PozyxSerial, POZYX_SUCCESS
from pypozyx.structures.device_information import DeviceDetails
from multiprocessing import Lock

# Constants 
MODE_REAL_TIME_TEST = 'R'
MODE_VISIT          = 'V'

"""
The data probe is in charge of retreiving the data from every part of the code in order to
format a row that will be added to the data buffer. The data in question consists of information
cocerning : The ID of the pozyx, the date, the mode.

The retrieved data is used by the data buffer, which takes care of writting the data in a csv file
and transfering it to a TCP server.
"""
class HeaderToBuffer :
    
    """ Constructor """
    def __init__(self, pozyx_lock=Lock()) :
        self.pozyx_lock = pozyx_lock

    """ Destructor """
    def __del__(self) :
        pass
    
    """
    Function to write the fist line of a CSV file.
    The content of the first line is the following :
    ______________________________________________________________
    | ID       | Date (Year-Month-Day)   | Test (T) or Visit (V) |
    --------------------------------------------------------------
    | 0xXXXX   | YYYY-MM-DD              | R or V                |
    --------------------------------------------------------------
    """
    def fetch_first_data_row(self) :
        # Fetching the informations necessary to print the first line
        data_buffer_row = []
        data_buffer_row.append(self.fetch_pozyx_id()       ) # ID 
        data_buffer_row.append(self.fetch_tag_date().date()) # Date
        data_buffer_row.append(self.fetch_tag_mode()       ) # Mode of operation
        return data_buffer_row

    """ Function to get the ID of the pozyx device connected """
    def fetch_pozyx_id(self) -> int:
        serial_port = get_first_pozyx_serial_port()
        if serial_port is None:
            print("No Pozyx connected. There might be a problem with the USB cable or the driver.")
            return 0x0000

        self.pozyx_lock.acquire()
        pozyx = PozyxSerial(serial_port)
        system_details = DeviceDetails()
        status = pozyx.getDeviceDetails(system_details, remote_id=None)
        self.pozyx_lock.release()

        if status == POZYX_SUCCESS :
            return system_details.id
        else :
            print("A problem occured when reading the POZYX's system details. ID 0x0000 is returned for this data aquisition.")
            return 0x0000
    
    """ Function to get the date and time of the system """
    def fetch_tag_date(self) -> datetime :
        return datetime.today()

    """
    Function to mode of operation of the tag during the current acquisition.
    MODE_TEST  = 'T' :  Used for tests done on the tag. Generally, this mode is used in combination with 
                        TCP transmission
    MODE_VISIT = 'V' :  Used for the real deployment of the system. The data acquired in this mode will
                        be used for further data analysis
    """
    def fetch_tag_mode(self) -> str:
        return "T" #TODO: Implement a real method to acquire the mode