import time

# Mock data provider that will continuously send new data
# Automatically ends after a set time
def container_main(data, send):
    print("Component 1 is called with data: ", data)
    # Process data
    processed_data = data
    # send data to the next component
    for i in range(0, 10):
        time.sleep(1)
        send({ "data": "Hello from component 1: " + str(i)})    
    send("~~EOD~~")
    return "Component 1 finished processing"