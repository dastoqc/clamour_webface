import sys

MODE_ARG = 'mode:'
IP_ARG   = 'ip:'
PORT_ARG = 'port:'

def getArguments(arguments):
    for arg in sys.argv:
        if MODE_ARG in arg:
            print('Change the mode for this mode')
        if IP_ARG   in arg:
            print('Change the default IP adress for this IP adress')
        if PORT_ARG in arg:
            print ('Change the default port for this port')

def changeMode(argument):
    argument.replace()
    pass


getArguments(sys.argv)

print('End of this script')