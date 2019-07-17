#!/usr/bin/env python

import socket

"""
This class is meant to transfer the data received to it's TCP socket in order to allow real-time
data transmission.
"""
class TcpSender :
    """
    Constructor
    """
    def __init__(self, remote_host=1, remote_port=2) :
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.remote_host = remote_host
        self.remote_port = remote_port
        self.max_response_byte_size = 1024
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
        if remote_host is None:
            self.remote_host = remote_host
        if remote_port is None:
            self.remote_port = remote_port
        
        # Attempting a connection
        try :
            socket.connect((remote_host, remote_port))
        except :
            print('TCP connection to {}:{} failed'.format(self.remote_host, self.remote_port))
        else : 
            self.is_tcp_connected = True
            print('TCP connection sucessful to {}:{}'.format(self.remote_host, self.remote_port))
        return self.is_tcp_connected


    """
    Function to create CSV file name
    """
    def write_list_to_csv(self, data) :
        self.socket.send(data)
