#!/usr/bin/env python

from dataBuffer import global_data_buffer
from datetime import datetime
from pypozyx import get_first_pozyx_serial_port, PozyxSerial, POZYX_SUCCESS
from pypozyx.structures.device_information import DeviceDetails
from json import load

# Parsing data according to the configuration file
with open('config.json') as config_file:
    config = load(config_file)
X_POSSITION_INDEX   = config['row_index']['x_coordinate' ]
Y_POSSITION_INDEX   = config['row_index']['y_coordinate' ]
Z_POSSITION_INDEX   = config['row_index']['z_coordinate' ]
X_SPEED_INDEX       = config['row_index']['x_speed'      ]
Y_SPEED_INDEX       = config['row_index']['y_speed'      ]
Z_SPEED_INDEX       = config['row_index']['z_speed'      ]
YAW_INDEX           = config['row_index']['yaw'          ]
YAW_VARIATION_INDEX = config['row_index']['yaw_variation']

"""
The data probe is in charge of retreiving the data from every part of the code in order to
format a row that will be added to the data buffer. The data in question consists of information
cocerning : time, localization, volume.

The retrieved data is transfered to the data buffer, which takes care of writting the data in a
csv file.
"""
class RealTimeDataProbe:

    """
    Constructor
    """
    def __init__(self) :
        self.data_buffer   = global_data_buffer
        self.start_time    = datetime.now()
        self.previous_time = self.start_time

    """
    Destructor
    """
    def __del__(self) :
        pass

    """
    Acquisition of all the data for a point (time, position, speed, volume).
    The datas are then stored in a buffer rows of an array in order to be written in batches in a
    csv file once the amount of data reaches a certain amount or once the tag is in a non active 
    situation where the transcription of data would not slow the localization process.

    The format of the row once the acquisition is accomplished is the following :
    __________________________________________________________________________________________________________________________________________
    | Time of the day | Time since the beginning | Delta time  | x    | y    | Z    | x speed  | y speed  | z speed  | yaw   | yaw variation |
    ------------------------------------------------------------------------------------------------------------------------------------------
    | hh:mm:ss.mmmmmm | ss.mmmmmm                | ss.mmmmmm   | XXXX | XXXX | XXXX | XXXX     | XXXXX    | XXXX     | XXXXX | XXXX          |
    ------------------------------------------------------------------------------------------------------------------------------------------
    """
    def full_sample_acquisition(self, state_vector) :
        self.fetch_time_data()
        self.fetch_localization_data(state_vector)
        self.data_buffer.add_row()

    """
    Fetchsing of the time stamps
    """
    def fetch_time_data(self) :
        acquisition_time = datetime.now()
        self.data_buffer.take_element( acquisition_time.time()                               ) # Time of the day 
        self.data_buffer.take_element((acquisition_time - self.start_time).total_seconds()   ) # Time since the beginning
        self.data_buffer.take_element((acquisition_time - self.previous_time).total_seconds()) # Delta time
        self.previous_time = acquisition_time

    """
    Function to acquire the location informations.
    This includes three dimensional location and speed.
    """
    def fetch_localization_data(self, state_vector) :
        self.data_buffer.take_element(state_vector[X_POSSITION_INDEX    ]) # x coordinate
        self.data_buffer.take_element(state_vector[Y_POSSITION_INDEX    ]) # y coordinate
        self.data_buffer.take_element(state_vector[Z_POSSITION_INDEX    ]) # z coordinate
        self.data_buffer.take_element(state_vector[X_SPEED_INDEX        ]) # x speed
        self.data_buffer.take_element(state_vector[Y_SPEED_INDEX        ]) # y speed
        self.data_buffer.take_element(state_vector[Z_SPEED_INDEX        ]) # z speed
        self.data_buffer.take_element(state_vector[YAW_INDEX            ]) # yaw coordinate
        self.data_buffer.take_element(state_vector[YAW_VARIATION_INDEX  ]) # yaw variation
