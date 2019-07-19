from sys import argv
from json import load, dumps
from re import compile, match

# Parsing data according to the configuration file
with open('config.json') as config_file:
    config = load(config_file)

# Control parameters
MODE        = config['default_mode']
TCP_ENABLED = config['default_connection']['enabled']
TCP_HOST    = config['default_connection']['host'   ]
TCP_PORT    = config['default_connection']['port'   ]

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
This class is meant to take the excecution parameters and configure the data
management accordingly
"""
class ArgumentParser :

    """ Constructor"""
    def __init__(self, arguments = []):
        self.arguments = arguments

    """ Destructor """
    def __del__(self):
        pass

    """ Method to add a parameter to the list of parameters """
    def add_argument(self, argument):
        self.arguments + argument

    """ 
    Method to take the parameters sent during the initialization of the data
    acquisition and to initialize the data manager accordingly
    """
    def manage_arguments(self):
        for arg in self.arguments:
            if ARG_MODE in arg:
                self.set_mode(arg)

            elif ARG_TCP  in arg:
                self.set_tcp_enabling(arg)
                
            elif ARG_HOST in arg:
                self.set_host(arg)

            elif ARG_PORT in arg:
                self.set_port(arg)

    """ Sets the mode to 'test' or 'visit' """
    def set_mode(self, argument):
        value = argument.replace(ARG_MODE, '')
        if value == ARG_MODE_VALUE_VISIT  :
            MODE = ARG_MODE_VALUE_VISIT
        elif value == ARG_MODE_VALUE_TEST :
            MODE = ARG_MODE_VALUE_TEST
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_MODE))
            return
        print('The mode was set to "{}"'.format(value))

    """ Enables or disable the tcp transmission """
    def set_tcp_enabling(self, argument):
        value = argument.replace(ARG_TCP, '')
        if value == ARG_TCP_VALUE_ENABLED :
            TCP_ENABLED = True
        elif value == ARG_TCP_VALUE_DISABLED :
            TCP_ENABLED = False
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_TCP))
            return
        print('The TCP transmission was set to "{}"'.format(value))

    """ Sets the IP address """
    def set_host(self, argument):
        value = argument.replace(ARG_HOST, '')
        if bool(ARG_HOST_REGULAR_EXPRESSION.match(value)):
            TCP_HOST = value
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_HOST))
            return
        print('The host for TCP transmission was set to {}'.format(value))

    """ Sets the port """
    def set_port(self, argument):
        value = argument.replace(ARG_PORT, '')
        if value.isdigit() and int(value) > 0 and int(value) < 0xFFFF :
            TCP_PORT = int(value)
        else :
            print('The value "{}" of the "{}" argument was not recognized.'.format(value, ARG_PORT))
            return
        print('The port for TCP transmission was set to "{}"'.format(value))