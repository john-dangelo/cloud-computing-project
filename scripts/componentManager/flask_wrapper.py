from flask import Flask, request
from pymongo import MongoClient
import requests

app = Flask(__name__)

client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
workflowDB = client['workflow']
activeJobList = workflowDB['active_job_list']

resultDB = client['results']
output = resultDB['output']

workflowID = 0
containerAddress = ""

@app.route("/", methods=['GET','POST'])
def wrapper_method():
    if request.method == 'POST':
        workflowID = request.get_json['workflowID']
        containerAddress = request.get_json['containerAddress']
        return container_main(request.get_json['data'])
    
#return next address or -1 if at the end or not found
def getNextAddress():
    activeJob = activeJobList.find_one({'_id':workflowID})
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

def send(data):
    nextAddress = getNextAddress()
    package = {}
    package.update({"workflowID" : workflowID})
    package.update({"containerAddress": nextAddress })
    package.update({"data": data})
    #end or not found
    if(nextAddress == -1):
        output.insert_one({"workflowId":workflowID, "data":data})
    else:
        #otherwise pass the data on
        requests.post("localhost:"+nextAddress, data)

def __main__():
    app.run(host="localhost", port=8000, debug=True)