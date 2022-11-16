from flask import Flask, request
from pymongo import MongoClient
import requests

app = Flask(__name__)

client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
workflowDB = client['workflow']#update maybe
activeJobList = workflowDB['active_job_list']#update with exact names

resultDB = client['results']#update maybe
output = resultDB['output']#update with exact names

workflowID = 0
containerAddress = ""

@app.route("/", methods=['GET','POST'])
def wrapper_method():
    if request.method == 'POST':
        workflowID = request.get_json['workflowID']
        containerAddress = request.get_json['containerAddress'] #might need to change name
        return container_main(request.data)

def send(data):
    nextAddress = getNextAddress()

    data["workflowID"] = workflowID
    data["containerAddress"] = nextAddress #might need to change name
    #end or not found
    if(nextAddress == -1):
        output.insert_one({"workflowId":workflowID, "data":data})
    else:
        #otherwise pass the data on
        requests.post(nextAddress, data)

#return next address or -1 if at the end or not found
def getNextAddress():
    activeJob = activeJobList.find_one({'job_id':workflowID})
    nextAddress = -1
    workflowComponents = activeJob['component_addresses']
    #look for the address
    for compAddressIndex in range(len(workflowComponents)):
        #found a match for the current address
        if(workflowComponents[compAddressIndex] == containerAddress):
            #check if its the last node
            if(compAddressIndex == len(workflowComponents) ):
                return -1
            #otherwise, return the next address
            return workflowComponents[compAddressIndex +1]
            
    #no match found
    return nextAddress
