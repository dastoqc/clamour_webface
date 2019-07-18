#!/usr/bin/python3

from multiprocessing import Process, Queue
from realTimeDataProbe import RealTimeDataProbe
import random

class DataProbe :
    def __init__(self, pozyx_lock=None) :
        self.data_to_manage_queue = Queue()
        self.dataManaging_process = Process(target=self.data_management_method, args=((self.data_to_manage_queue),))
        self.dataManaging_process.start()

    def __del__(self) :
        self.dataManaging_process.join()

    def get_data(self, data) :
        self.data_to_manage_queue.put(data[:])  

    def data_management_method(self, multiprocessing_queue, pozyx_lock=None):
        dataManager = RealTimeDataProbe()
        while True :
            if not multiprocessing_queue.empty() :
                dataManager.full_sample_acquisition(multiprocessing_queue.get())

if __name__ == "__main__":
    data_manager = DataProbe()

    state_vector = []
    for i in range(10) :
        for j in range(8) :
            state_vector.append(random.randint(0,20000))
        data_manager.get_data(state_vector)
        state_vector.clear()

