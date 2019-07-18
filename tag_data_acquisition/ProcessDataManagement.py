#!/usr/bin/python3

from multiprocessing import Process, Queue
from realTimeDataProbe import RealTimeDataProbe
import random




def data_management_method(multiprocessing_queue):
    dataManager = RealTimeDataProbe()
    while True :
        if not multiprocessing_queue.empty() :
            #print('Process 2 :', multiprocessing_queue.get())
            dataManager.full_sample_acquisition(multiprocessing_queue.get())

if __name__ == "__main__":
    state_vector = []
    data_to_manage_queue = Queue()
    dataManaging_process = Process(target=data_management_method, args=(data_to_manage_queue,))
    dataManaging_process.start()
    for i in range(10) :
        for j in range(8) :
            state_vector.append(random.randint(0,20000))
        data_to_manage_queue.put(state_vector[:])
        #print('Process 1 :', state_vector)
        state_vector.clear()
    dataManaging_process.join()

    
























class dataManagementProcess :
    def __init__(self, data_queue=None, pozyx_lock=None) :
        self.data_to_manage_queue = data_queue
        self.dataManaging_process = Process(target=self.data_management_method, args=((data_to_manage_queue),))
        self.dataManaging_process.start()

    def get_data(self, data) :
        self.data_to_manage_queue.put(data)

    def data_management_method(self, multiprocessing_queue, pozyx_lock=None):
        dataManager = RealTimeDataProbe()
        while True :
            dataManager.full_sample_acquisition(multiprocessing_queue.get(block=True, timeout=False).data)