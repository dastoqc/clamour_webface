from sys import argv
from json import load, dumps

# Parsing data according to the configuration file
with open('config.json') as config_file:
    config = load(config_file)

# Control parameters
MODE        = config['default_mode']
TCP_ENABLED = config['default_connection']['enabled']
HOST        = config['default_connection']['host'   ]
PORT        = config['default_connection']['port'   ]

# Constants
MODE_ARG = 'mode:'
IP_ARG   = 'ip:'
PORT_ARG = 'port:'
TCP_ARG  = 'tcp:'

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

    """ 
    Method to take the parameters sent during the initialization of the data
    acquisition and to initialize the data manager accordingly
    """
    def management_arguments(self, arguments=None):
        self.arguments.append(arguments)
        for arg in argv:    
            if TCP_ARG  in arg:
                print('TCP communication enabled (if connexion succesful)') 

            if MODE_ARG in arg:
                print('Change the mode for this mode')

            if IP_ARG   in arg:
                print('Change the default IP adress for this IP adress')

            if PORT_ARG in arg:
                print ('Change the default port for this port')

    """ Sets th mode to 'test' or 'visit' """
    def set_mode(self, argument):
        value = argument.replace(MODE_ARG, '')
        if value == 'visit' :
            MODE = 'visit'
        elif value == 'test' :
            MODE = 'test'
        else :
            print('The value {} of the {} argument was not recognized.'.format(argument, MODE_ARG))
            return
        print('The mode was set to {}'.format(argument))

    """ Enable or disable the tcp transmission """
    def set_tcp_enabling(self, argument):
        value = argument.replace(TCP_ARG, '')
        if value == 'visit' :
            MODE = 'visit'
        elif value == 'test' :
            pass

    """ Set the IP address """
    def set_ip_adress(self, argument):
        argument.replace(MODE_ARG, '')
        if argument == 'visit' :
            MODE = 'visit'
        elif argument == 'test' :
            pass

    """ Set the port """
    def set_port(self, argument):
        argument.replace(MODE_ARG, '')
        if argument == 'visit' :
            MODE = 'visit'
        elif argument == 'test' :
            pass

argument_parser = ArgumentParser(argv)
print('End of this script')
print(argv)