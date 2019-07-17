#!/usr/bin/env python

from datetime import datetime

from pypozyx import get_first_pozyx_serial_port, PozyxSerial, POZYX_SUCCESS
from pypozyx.structures.device_information import DeviceDetails

class StaticDataProbe :
    
    """
    Constructor
    """
    def __init__(self) :
        pass

    """
    Destructor
    """
    def __del__(self) :
        pass
    
    """
    Function to write the fist line of a CSV file.
    The content of the first line is the following :
    ______________________________________
    | ID       | Date (Year-Month-Day)   |
    --------------------------------------
    | 0xXXXX   | YYYY-MM-DD              |
    --------------------------------------
    """
    def fetch_first_data_row(self) :
        # Fetching the informations necessary to print the first line
        data_buffer_row = []
        data_buffer_row.append(self.fetch_pozyx_id()       ) # ID 
        data_buffer_row.append(self.fetch_tag_date().date()) # Date
        return data_buffer_row

    """
    Function to get the ID of the pozyx device connected
    """
    def fetch_pozyx_id(self) -> int:
        serial_port = get_first_pozyx_serial_port()
        if serial_port is None:
            print("No Pozyx connected. There might be a problem with the USB cable or the driver.")
            return 0x0000
        pozyx = PozyxSerial(serial_port)
        system_details = DeviceDetails()
        status = pozyx.getDeviceDetails(system_details, remote_id=None)
        if status == POZYX_SUCCESS :
            return system_details.id
        else :
            print("A problem occured when reading the POZYX's system details. ID 0x0000 is returned for this data aquisition.")
            return 0x0000
    
    """
    Function to get the date and time of the system
    """
    def fetch_tag_date(self) -> datetime :
        return datetime.today()