#!/usr/bin/env python

from socket import socket, AF_INET, SOCK_STREAM
from datetime import date, time
from argumentParser import TCP_ENABLED, TCP_HOST, TCP_PORT
from json import dumps

# Constant definition
TAG_HEADER = 'h'
TAG_DATA   = 'd'

"""
This class is meant to transfer the data received to it's TCP socket in order to allow real-time
data transmission.
"""
class BufferToTcp :

    """ Constructor """
    def __init__(self, remote_host=TCP_HOST, remote_port=TCP_PORT, tcp_enabled=TCP_ENABLED) :
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.tcp_enabled = tcp_enabled
        self.remote_host = remote_host
        self.remote_port = remote_port
        self.tcp_connected = False

    """
    Destructor
    """
    def __del__(self) :
        self.socket.close()

    """ Establishes a connection to transfer the data, if the TCP transmission is enabled """
    def succed_connection(self, remote_host=None, remote_port=None) -> bool:
        # Setting attributes as default values
        if remote_host is not None:
            self.remote_host = remote_host
        if remote_port is not None:
            self.remote_port = remote_port
        
        # Attempting a connection, if the TCP was enabled
        if self.tcp_enabled :
            try :
                self.socket.connect((self.remote_host, self.remote_port))
            except :
                print('TCP connection to {}:{} failed'.format(self.remote_host, self.remote_port))
            else : 
                self.tcp_connected = True
                print('TCP connection sucessful to {}:{}'.format(self.remote_host, self.remote_port))
        else :
            print('No TCP connection was attempted to {}:{} since the TCP transmission is disabled'.\
                  format(self.remote_host, self.remote_port))
        return self.tcp_connected

    """ Function to send data to socket """
    def send_data(self, data, tag=TAG_DATA) :
        """
        Default serialization rule for types not supported by json.dumps()
        """
        def serialization_rules(element):
            if isinstance(element, date):
                return element.__str__()
            if isinstance(element, time):
                return element.__str__()
        # TCP transmission if it is enabled and connected
        if self.tcp_enabled and self.tcp_connected :
            serialized_data = dumps([tag, data], default=serialization_rules)
            self.socket.send(serialized_data.encode())

        else :
            print('TCP transmission failed : TCP enabled ({}), TCP connected ({}) '.\
                  format(self.tcp_enabled, self.tcp_connected))