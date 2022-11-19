def container_main(data):
    while True:
        print(data)
        send({ "name" : "component2", "data": data })