#!/usr/bin/env python

from socket import socket, AF_INET, SOCK_STREAM
from json import load, dumps
from datetime import date, time

# Parsing data according to the configuration file
with open('config.json') as config_file:
    config = load(config_file)
DEFAULT_HOST = config['default_connection']['host']
DEFAULT_PORT = config['default_connection']['port']

# Constant definition
TAG_HEADER = 'h'
TAG_DATA   = 'd'

"""
This class is meant to transfer the data received to it's TCP socket in order to allow real-time
data transmission.
"""
class BufferToTcp :

    """
    Constructor
    """
    def __init__(self, remote_host=DEFAULT_HOST, remote_port=DEFAULT_PORT) :
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.remote_host = remote_host
        self.remote_port = remote_port
        self.is_tcp_connected = False

    """
    Destructor
    """
    def __del__(self) :
        self.socket.close()

    """
    Creation of the connection to transfer the data
    """
    def succed_connection(self, remote_host=None, remote_port=None) -> bool:
        # Setting attributes as default values
        if remote_host is not None:
            self.remote_host = remote_host
        if remote_port is not None:
            self.remote_port = remote_port
        
        # Attempting a connection
        try :
            self.socket.connect((self.remote_host, self.remote_port))
        except :
            print('TCP connection to {}:{} failed'.format(self.remote_host, self.remote_port))
        else : 
            self.is_tcp_connected = True
            print('TCP connection sucessful to {}:{}'.format(self.remote_host, self.remote_port))
        return self.is_tcp_connected

    """
    Function to send data to socket
    """
    def send_data(self, data, tag=TAG_DATA) :
        """
        Default serialization rule for types not supported by json.dumps()
        """
        def serialization_rules(element):
            if isinstance(element, date):
                return element.__str__()
            if isinstance(element, time):
                return element.__str__()
        
        serialized_data = dumps([tag, data], default=serialization_rules)
        self.socket.send(serialized_data.encode())