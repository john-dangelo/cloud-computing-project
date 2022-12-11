from flask import Flask, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import sys
import requests
import component

app = Flask(__name__)

client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
workflowDB = client['workflow']
activeJobList = workflowDB['active_job_list']

resultDB = client['results']
output = resultDB['output']
log = resultDB['log']

eodMessage = "~~EOD~~"

@app.route("/", methods=['GET','POST'])
def wrapper_method():
    print("Request")
    print(request)
    if request.method == 'POST':
        json = request.get_json()
        global eodMessage
        workflowID = json['workflowId']
        containerAddress = json['containerAddress']
        print("Wrapper service received POST request", sys.stdout)
        print(json, sys.stdout)
        #check for end of data and re-route if recieved
        # log_data(workflowID,containerAddress, "Received POST Request", json['data'])
        if(json['data'] == eodMessage):
            createSend(workflowID, containerAddress)(eodMessage)
            return "Completed"
        result = component.container_main(json['data'], createSend(workflowID, containerAddress), sys.argv)
        if (result == None):
            return "Error"
        return result
    if request.method == 'GET':
        # test only
        # print("Making mock request")
        # print(request.get("localhost:8001").text) # doesnt work
        return "Service is running."
    
#return next address or -1 if at the end or not found
def getNextAddress(workflowID, containerAddress):
    activeJob = activeJobList.find_one({'_id': ObjectId(workflowID)})
    nextAddress = -1
    workflowComponents = activeJob['component_addresses']
    #look for the address
    for compAddressIndex in range(len(workflowComponents)):
        #found a match for the current address
        if(workflowComponents[compAddressIndex] == containerAddress):
            #check if its the last node
            if(compAddressIndex == (len(workflowComponents) - 1) ):
                return -1
            #otherwise, return the next address
            return workflowComponents[compAddressIndex +1]
            
    #no match found
    return nextAddress

def log_data(wfID,currAdd,nextAdd,data):
    log.insert_one({"workflowId":wfID, "currentAddress": currAdd, "nextAddress":nextAdd, "data":data,"timestamp":datetime.now()})
    return True

def createSend(workflowID, containerAddress):
    def send(data):
        global eodMessage
        nextAddress = getNextAddress(workflowID, containerAddress)
        package = {}
        package.update({"workflowId" : workflowID})
        package.update({"containerAddress": nextAddress })
        package.update({"data": data})
        log_data(workflowID,containerAddress,nextAddress,data)
        #end or not found
        if(nextAddress == -1):
            if(data == eodMessage):
                setWFtoDone(workflowID)
            else:
                output.insert_one({"workflowId":workflowID, "data":data})
        else:
            #otherwise pass the data on
            # Triet: after testing, I found out that
            # for component-to-component communication
            # the request needs to have the ComponentName:ComponentPort format
            # e.g. requests.post("component1:8000", data)
            requests.post(nextAddress, json=package)
    return send

def setWFtoDone(workflowID):
    newVal = {"$set":{"state":"done"}}
    activeJobList.update_one({'_id': ObjectId(workflowID)},newVal)

if __name__ == '__main__':
    print('Running service...')
    app.run(host="0.0.0.0", port=8000, debug=True)
