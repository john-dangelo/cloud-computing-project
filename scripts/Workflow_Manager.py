# -*- coding: utf-8 -*-
"""
Workflow Manager

Created on Mon Sep 26 13:07:44 2022
@author: John DAngelo
"""
import os
import json
import time
import requests
from dataclasses import dataclass
from pymongo import MongoClient


# Useful for connecting dataclasses with MongoDB
# http://strakul.blogspot.com/2019/05/data-science-python-dataclasses-and.html
@dataclass
class Component:
    name: str         # Image name of component, not unique
    id: str           # Unique number to differentiate components with the same parameters
    port: str         # The unique port that I use to send the first POST
    command: str      # String that is sent to container on startup
    degree: int = 1   # Number of active workflows using this component
    
    def address(self):
        return "http://" + self.containerName().split('/', 2)[1] + ":8000"
    def containerName(self):
        return self.name + "_" + self.id
    def to_json(self):
        return json.dumps(self.__dict__, default=lambda x: x.__dict__, indent=4)

# Connect to DBs
# https://pymongo.readthedocs.io/en/stable/tutorial.html
# (empty for default localhost) or (host, port) or (MongoDB URI, 'mongodb://localhost:27017/')
client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
internalDB = client['workflow']
externalDB = client['results']

# Get collections
activeJobList = internalDB['active_job_list']
tempOutput = internalDB['temp_output']
output = externalDB['output']

# Track currently running components
activeComponents = []
# Number assigned to differentiate components
nextID = 1
# Starting custom address for the components
nextPort = 40000
# Needed for sending the POST to start the workflow
firstComp = None

# Debug constants
DEBUG_LOGGING = True
TIME_LOGGING = False # Log how long it takes to start each workflow
LOOP_TIME = 5
COMPONENT_SHARING = True # Whether to use the same component for different workflows
SINGLE_NODE = False # Run all components on the node specified in the constraint string
#LOG_FILENAME = "WFM.log"
#with open(LOG_FILENAME, "w") as file1:
#file1.write("Hello \n")


# Debug printing helper
def DLog(message):
    if(DEBUG_LOGGING):
        print(message)

# Send the workflow ID to the first component in a workflow, causing it to start sending data forward
def sendStartPOST(wfID, port, address):
    sendingAddress =  "http://managernode:" + port
    dict = { "workflowId":str(wfID), "containerAddress":address, "data": {} }
    # Absolute hack, but we don't need to care about the response and don't want to block
    try:
        requests.post(sendingAddress, json=dict, timeout=0.0000000001)
    except requests.exceptions.ReadTimeout:
        pass
    
    DLog("Start POST sent for workflow " + str(wfID))

# Start the specified component image and return it
def startComponent(name, command):
    global nextID, nextPort
    
    newComp = Component(name, str(nextID), str(nextPort), command)
    nextID += 1
    nextPort += 1
    
    docker =  "sudo docker service create --restart-condition=none --network internaldb_mongo "
    name =    "--name " + newComp.containerName().split('/', 2)[1] + " "
    publish = "--publish " + newComp.port + ":8000 "
    constraint = "--constraint node.labels.loadtest2==true "
    image =   newComp.name + ":latest "
    
    DLog("\nStarting " + newComp.containerName())
    if SINGLE_NODE:
        os.system(docker + name + publish + constraint + image + command)
    else:
        os.system(docker + name + publish + image + command)
    
    activeComponents.append(newComp)
    
    return newComp

# Start each listed component, or increment its degree if it is already running
def startComponents(componentsToStart, commands, wfID):
    global firstComp
    
    print("\nComponents to be started:")
    print(componentsToStart)
    
    # Since the first datasource must be unique it is always started
    firstComp = startComponent(componentsToStart[0], commands[0])
    addressList.append(firstComp.address())
    
    # Start each component or see if it is already active
    for i in range(1, len(componentsToStart)):
        # Check the list of active components for the one we want to start
        active = next((x for x in activeComponents if (x.name == componentsToStart[i] and x.command == commands[i])), None)
        
        # If the component is currently running, increment its degree
        if COMPONENT_SHARING and active is not None:
            comp = active
            print(active.name + " already running")
            active.degree += 1
        # Else, it could not be found (it is not running), so start it
        else:
            comp = startComponent(componentsToStart[i], commands[i])
        
        addressList.append(comp.address())


# Main working loop
while (True):
    # Check for pending jobs, start all required components, set job to 'working'
    cursor = activeJobList.find({'state': 'pending'})
    for job in cursor:
        # Start timer for time logging
        if TIME_LOGGING:
            start = time.time()
        
        # Error check for empty jobs, silently close them
        if(len(job['component_list']) == 0):
            job['state'] = 'closed'
            activeJobList.update_one({'_id':job['_id']}, {"$set": job}, upsert=False)
            continue
        
        DLog("\nNew job with ID: " + str(job['_id']))
        # Create entry for temporary output, can be used by intermediate nodes
        tempOutput.insert_one({'_id': job['_id']})
        
        # The address for each component, needed by in the DB for dataflow wrapper.  Must be cleared every loop
        addressList = []
        
        # Start the necessary components for this job
        startComponents(job['component_list'], job['parameters'], job['_id'])
        
        # All components are running, update the collection
        job['state'] = 'working'
        job['component_addresses'] = addressList
        activeJobList.update_one({'_id':job['_id']}, {"$set": job}, upsert=False)
        
        # Send start message to the first component to bein the workflow
        sendStartPOST(str(job['_id']), firstComp.port, firstComp.address())
        
        if TIME_LOGGING:
            print("Time taken: " + str(time.time() - start) + "s")
        
        DLog("Job " + str(job['_id']) + " started\n\n")
    
    
    # Check for finished jobs, remove them from the DB, and shutdown unused components
    cursor = activeJobList.find({'state': 'done'})
    for job in cursor:
        DLog("Closing workflow " + str(job['_id']))
        
        # Remove this workflow's entries from the temp output and active job collections
        tempOutput.delete_one({'_id': job['_id']})
        # Preserve the entry so the logs have something to point to
        job['state'] = 'closed'
        activeJobList.update_one({'_id':job['_id']}, {"$set": job}, upsert=False)
        
        # Search the activeComponents for each address we want to decrement/shutdown.  Dont need name since address is unique
        for addr in job['component_addresses']:
            for i, comp in enumerate(activeComponents):
                if comp.address() == addr:
                    # Shut down if this is the last workflow that used component (degree of 0)
                    comp.degree -= 1
                    if (comp.degree == 0):
                        os.system("sudo docker service rm " + comp.containerName().split('/', 2)[1])
                        del activeComponents[i]
                    break
    
    
    print(". . .")
    for comp in activeComponents:
      DLog(comp)
    
    time.sleep(LOOP_TIME)
