def container_main(data, send):
    print("Component 1 is called with data: ", data)
    # Process data
    processed_data = data
    # send data to the next component
    send("~~EOD~~")
    return "Component 1 finished processing"