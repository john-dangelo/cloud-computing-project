def container_main(data, send):
    print("Component 1 is called with data: ", data)
    # Process data
    processed_data = data
    # send data to the next component
    send({"my_message": "hello from component 1"})
    return True