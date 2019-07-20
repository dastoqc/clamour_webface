from sys import argv
from json import load, dumps
from re import compile, match

# Argument syntaxical constants
ARG_MODE = 'mode:'
ARG_TCP  = 'tcp:'
ARG_HOST = 'host:'
ARG_PORT = 'port:'
ARG_MODE_VALUE_VISIT        = 'visit'
ARG_MODE_VALUE_TEST         = 'test'
ARG_TCP_VALUE_ENABLED       = 'enabled'
ARG_TCP_VALUE_DISABLED      = 'disabled'
ARG_HOST_REGULAR_EXPRESSION = compile(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b")

"""
This class is meant to take the excecution parameters and configure the data management accordingly
"""
class ArgumentParser :

    """ Constructor"""
    def __init__(self):
        self.mode        = None
        self.tcp_enabled = None
        self.tcp_host    = None
        self.tcp_port    = None
        with open('config.json') as config_file:
            self.default_values = load(config_file)
        self.manage_arguments()


    """ Destructor """
    def __del__(self):
        pass

    """ 
    Method to take the parameters sent during the initialization of the data acquisition and to 
    initialize the data manager accordingly
    """
    def manage_arguments(self):
        for arg in argv:
            if ARG_MODE in arg:
                self.set_mode(arg)

            elif ARG_TCP  in arg:
                self.set_tcp_enabled(arg)
                
            elif ARG_HOST in arg:
                self.set_tcp_host(arg)

            elif ARG_PORT in arg:
                self.set_tcp_port(arg)

    """ Sets the mode to 'test' or 'visit' """
    def set_mode(self, argument):
        value = argument.replace(ARG_MODE, '')
        if value == ARG_MODE_VALUE_VISIT  :
            self.mode = ARG_MODE_VALUE_VISIT
        elif value == ARG_MODE_VALUE_TEST :
            self.mode = ARG_MODE_VALUE_TEST
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_MODE))
            return
        print('The mode was set to "{}"'.format(value))

    """ Enables or disable the tcp transmission """
    def set_tcp_enabled(self, argument):
        value = argument.replace(ARG_TCP, '')
        if value == ARG_TCP_VALUE_ENABLED :
            self.tcp_enabled = True
        elif value == ARG_TCP_VALUE_DISABLED :
            self.tcp_enabled = False
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_TCP))
            return
        print('The TCP transmission was set to "{}"'.format(value))

    """ Sets the IP address """
    def set_tcp_host(self, argument):
        value = argument.replace(ARG_HOST, '')
        if bool(ARG_HOST_REGULAR_EXPRESSION.match(value)):
            print('The host for TCP transmission was set to {}'.format(value))
            self.tcp_host = value
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_HOST))

    """ Sets the port """
    def set_tcp_port(self, argument):
        value = argument.replace(ARG_PORT, '')
        if value.isdigit() and int(value) > 0 and int(value) < 0xFFFF :
            print('The port for TCP transmission was set to "{}"'.format(value))
            self.tcp_port = int(value)
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_PORT))

    """ 
    Returns the mode parsed found in the arguments or the default mode of the configuration file if no 
    mode argument was recongnised
    """
    def get_mode(self):
        if self.mode == None :
            return self.default_values['default_mode']
        else :
            return self.mode

    """ 
    Returns the tcp enabled value parsed found in the arguments or the default mode of the configuration
    file if no tcp enabled argument was recongnised
    """
    def get_tcp_enabled(self):
        if self.tcp_enabled == None :
            return self.default_values['default_connection']["enabled"]
        else :
            return self.tcp_enabled
    
    """ 
    Returns the tcp port parsed found in the arguments or the default mode of the configuration file if no
    tcp host argument was recongnised
    """
    def get_tcp_host(self):
        if self.tcp_host == None :
            return self.default_values['default_connection']["host"]
        else :
            return self.tcp_host

    """ 
    Returns the tcp host parsed found in the arguments or the default mode of the configuration file if no
    tcp port argument was recongnised
    """
    def get_tcp_port(self):
        if self.tcp_port == None :
            return self.default_values['default_connection']["port"]
        else :
            return self.tcp_port

# Parsing data according to the configuration file
argument_parser = ArgumentParser()
MODE        = argument_parser.get_mode()
TCP_ENABLED = argument_parser.get_tcp_enabled()
TCP_HOST    = argument_parser.get_tcp_host()
TCP_PORT    = argument_parser.get_tcp_port()