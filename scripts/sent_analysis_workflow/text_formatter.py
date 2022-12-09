
acceptedChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM ,.!?'1234567890"

def container_main(data,send):
    strippedComm = ""
    for letter in data:
        if acceptedChars.find(letter) != -1:
            strippedComm = strippedComm + letter
    send(strippedComm)