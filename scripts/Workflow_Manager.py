# -*- coding: utf-8 -*-
"""
Workflow Manager

Created on Mon Sep 26 13:07:44 2022
@author: John DAngelo
"""
import os
import json
import time
from dataclasses import dataclass
from pymongo import MongoClient


# Useful for connecting dataclasses with MongoDB
# http://strakul.blogspot.com/2019/05/data-science-python-dataclasses-and.html
@dataclass
class Component:
    name: str         # DB name of component, not unique
    id: int           # Unique number to differentiate components with different parameters
    parameters: str   # String that is sent to contain on startup
    address: str = "" # The port that other components will send to
    degree: int = 1   # Number of active workflows using this component
    
    def containerName(self):
        return self.name + self.id
    def to_json(self):
        return json.dumps(self.__dict__, default=lambda x: x.__dict__, indent=4)

# Connect to DBs
# https://pymongo.readthedocs.io/en/stable/tutorial.html
# (empty for default localhost) or (host, port) or (MongoDB URI, 'mongodb://localhost:27017/')
client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
internalDB = client['workflow']
externalDB = client['results']

# Get collections
# Active workflows/jobs collection (id, [component addresses], state, [parameters], workflow_name)
activeJobList = internalDB['active_job_list']
# Workflow definition collection(id, [component-type], [parameters])
workflows = internalDB['workflow_definitions']
# Temporary output (id, [output])
tempOutput = internalDB['temp_output']
# Final results (id, workflow name, [parameters], [output data])
output = externalDB['output']

# Track currently running components
activeComponents = []
# Number assigned to differentiate components
nextID = 0
# Address for the components
nextPort = 40000

#temp, to be replaced by other command
#os.system("sudo docker run --network internaldb_mongo -it managernode:5000/datafetcher:1.0.2 python dataFetcher.py 1234 -f 15")

# Add the workflow ID as the first parameter after the filename
def addWfID(parameters, wfID):
    paramList = parameters.split()
    newParams = paramList[0] + " " + str(wfID) #paramList[0] is the filename
    if len(paramList) > 1:
        for i in paramList[1:]:
            newParams += " " + i
    return newParams

# Start a container running the specified component type and remember its address
# Pass along id only for data source components (first one in list)
def startComponent(name, parameters, wfID=None):
    global nextID, nextPort
    
    newComp = Component(name, nextID, parameters, nextPort)
    nextID += 1
    nextPort += 1
    
    if wfID is not None:
        # Data source, first component, must include wfID in parameter list
        parameters = addWfID(parameters, wfID)
    
    docker = "sudo docker service create --restart-condition=none "
    name = "--name " + newComp.containerName + ":latest "
    network = "--network internaldb_mongo managernode:5000/" + newComp.name + " "
    publish = "--publish " + newComp.address + ":1000 "
    python = "python " + parameters
    os.system(docker + name + network + publish + python)
    
    # Get the address and add component to the lists
    activeComponents.append(newComp)
    addressList.append(newComp.address)

# Start each listed component, or increment its degree if it is already running
# componentsToStart is a list of strings for the name of each component to start
def startComponents(componentsToStart, parameters, wfID):
    print("startComponents() components to be started:")
    print(componentsToStart)
    
    # Skip first component since it is data source, and start it last
    for i in range(1,len(componentsToStart)):
        # Check the list of active components for the one we want to start
        active = next((x for x in activeComponents if (x.name == componentsToStart[i] and x.parameters == parameters[i])), None)
        
        # If that component could not be found (it is not running), start it
        if active is None:
            startComponent(componentsToStart[i], parameters[i])
        # Else, the name is found (it is currently running), so increment its degree
        else:
            active.degree += 1
            addressList.append(active.address)
        
    # The first node will be unique and will take the parameters
    # Wait for all other containers to be started and set up
    time.sleep(30)
    startComponent(componentsToStart[0], parameters[0], wfID)


# Main working loop
while (True):
    # Check for pending jobs, start all required components, set job to 'working'
    cursor = activeJobList.find({'state': 'pending'})
    for job in cursor:
        # Create entry for temp output, data inserted by intermediate nodes
        tempOutput.insert_one({'_id': job['_id']})
        # Create entry in final output collection, data inserted by last node
        output.insert_one({'_id': job['_id'], 'workflowName': job['workflowName'], 'parameters': job['parameters']})
        
        # Get the nodes for the workflow from the workflow definition collection
        names = workflows.find_one({'workflow-name': job['workflowName']})['nodesNecessary']
        # The address for each component, in order
        addressList = []
        
        startComponents(names, job['parameters'], job['_id'])
        
        # All components are running, update the collection
        job['state'] = 'working'
        job['addresses'] = addressList
        activeJobList.update_one({'_id':job['_id']}, {"$set": job}, upsert=False)
    
    
    # Check for finished jobs, remove them from the DB, and shutdown unused components
    cursor = activeJobList.find({'state': 'done'})
    for job in cursor:
        # Remove this workflow's entries from the temp output and active job collections
        tempOutput.remove({'_id': job['_id']})
        activeJobList.remove({'id': job['_id']})
        
        # Search the activeComponents for each address we want to decrement/shutdown
        # Dont need name since address is unique
        for addr in job['addresses']:
            for i, comp in enumerate(activeComponents):
                if comp.address == addr:
                    # Shut down if this is the last workflow that used component (degree of 0)
                    comp.degree -= 1
                    if (comp.degree == 0):
                        os.system("sudo docker stop " + comp.containerName)
                        del activeComponents[i]
                    break
                
    
    print("loop")
    
    if (True):
        break
    time.sleep(10)

