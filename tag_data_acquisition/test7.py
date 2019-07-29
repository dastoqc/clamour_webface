from datetime import datetime

acquisition_time = datetime.now()

time = datetime(2000,1,1,0,0,0,0)

print('Now time   : ', acquisition_time)
print('First time : ', time)
print('Time difference   : ', (acquisition_time - time))
print('Small difference  : ', (datetime.now() - acquisition_time))
print('Second difference : ', (datetime.now() - acquisition_time).total_seconds())