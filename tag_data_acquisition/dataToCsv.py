#!/usr/bin/env python

import os
import csv
from datetime import datetime
from staticDataProbe import StaticDataProbe

"""
This class manages the formatted creation and writting of csv files to contain the data of every
exploration. 
"""
class CsvWriter :
    """
    Constructor
    """
    def __init__(self) :
        self.path       = self.create_folder()
        self.csv_name   = self.generate_csv_file_name()
        self.csv_file   = open(os.path.join(self.path, self.csv_name), 'w+')
        self.csv_writer = csv.writer(self.csv_file, delimiter = ',', )

    """
    Destructor
    """
    def __del__(self) :
        self.csv_file.close()

    """
    Creation of the folder to contain the data
    """
    def create_folder(self) -> str:
        path = os.path.join(os.path.expanduser('~'), 'clamour_data/csv_buffer')
        if not os.path.exists(path) :
            os.makedirs(path, mode=0o777, exist_ok=True)
            print("The {} folder was created in order to contain the acquired data".format(path))
        return path

    """
    Function to create CSV file name
    """
    def generate_csv_file_name(self) -> str:
        # Acquisition of the ID and the date
        tag_information_seeker = StaticDataProbe()
        id   = tag_information_seeker.fetch_pozyx_id()
        date = tag_information_seeker.fetch_tag_date()

        # Formatting of the ID and the date for the name of the file and returning the file
        str_id      = "0x{:02x}".format(id)
        str_date    = datetime.strftime(date, '%Y-%m-%d-%H:%M')
        name_string = '{}_{}.csv'.format(str_id, str_date)
        print('Data file {} was successfully created'.format(name_string))
        return name_string

    """
    Function to create CSV file name
    """
    def write_list_to_csv(self, list) :
        self.csv_writer.writerows(list)
