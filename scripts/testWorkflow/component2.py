def container_main(data, send, args):
    print("Component 2 is called with data: ", data)
    # Process data
    processed_data = data
    # send data to the next component
    send({"my_message": "hello from component 2"})
    return "Component 2 finished processing"