import time

# Mock data provider that will continuously send new data
# Automatically ends after a set time
# example command: python flask_wrapper.py 20
def container_main(data, send, args):
    print("Component 1 is called with data: ", data)
    # Process data
    processed_data = data
    # send data to the next component
    end = 10
    if (args[1]):
        end = args[1]
    for i in range(0, end):
        time.sleep(1)
        send({ "data": "Hello from component 1: " + str(i)})    
    send("~~EOD~~")
    return "Component 1 finished processing"