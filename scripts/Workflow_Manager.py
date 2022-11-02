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


# Component will have a type, address, and degree (number of jobs using this component)
# Useful for connecting dataclasses with MongoDB
# http://strakul.blogspot.com/2019/05/data-science-python-dataclasses-and.html
@dataclass
class Component:
    type: str
    address: str
    degree: int = 1
    def to_json(self):
        return json.dumps(self.__dict__, default=lambda x: x.__dict__, indent=4)

# Connect to DB
# https://pymongo.readthedocs.io/en/stable/tutorial.html
# (empty for default localhost) or (host, port) or (MongoDB URI, 'mongodb://localhost:27017/')
client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
internalDB = client['workflow']

# Get collections
# Active workflows/jobs collection (id, [component addresses], state, [parameters], workflow_name)
activeJobList = internalDB['active_job_list']
# Workflow definition collection(id, [component-type], [parameters])
workflows = internalDB['workflow_definitions']
# Temporary output (id, [output])
tempOutput = internalDB['temp_output']
# Final results (id, [parameters], workflow name, [output])

# Track currently running components
activeComponents = []

os.system("sudo docker run --network internaldb_mongo -it managernode:5000/datafetcher:1.0.2 python dataFetcher.py 1234 -f 15")

# Start a container running the specified component type and remember its address
# Pass along id and parameters only for data source components (1st one in list)
def startComponent(type, id=None, parameters=None):
    #TODO
    if id is None:
        print("TODO start component:\t" + type)
    else:
        str = id + " " + parameters
        
        #os.system("sudo docker service create --restart-condition=none --name " + datafetcher + " --network internaldb_mongo managernode:5000/datafetcher:1.0.2 python dataFetcher.py 12345 -f 15")
        print("TODO start component " + id + ":\t" + type + " : ", parameters)
    addressList.append("addr")

# Start each listed component, or increment its degree if it is already running
# componentsToStart is a list of strings for the name of each component to start
def startComponents(componentsToStart, id, parameters):
    print(componentsToStart)
    # The address for each component, new or old, from the type list
    
    for name in componentsToStart[1:]:
        # Check the list of active components for the one we want to start
        active = next((x for x in activeComponents if x.type == name), None)
        # If that component name could not be found (it is not running), start it
        if active is None:
            startComponent(name)
        # Else, the name is found (it is currently running), so increment its degree
        else:
            active.degree += 1
            addressList.append(active.address)
       
    # The first node will be unique and will take the parameters
    # Wait for all other containers to be started and set up
    time.sleep(30)
    startComponent(componentsToStart[0], id, parameters)


def shutdownComponent(address):
    #TODO
    print("Shutting down component at " + address)


# Main working loop
while(False):
    
    # Check for pending jobs, start all required components, set job to 'working'
    cursor = activeJobList.find({'state': 'pending'})
    for job in cursor:
        # Create entry for temp output, will be deleted by last node after receiving last message
        tempOutput.insert_one(job['_id'], [])
        
        # Create entry in final output collection, data inserted by last node
        #TODO results.insert_one(job._id, job.parameters, job.workflowName, [])
        
        # Get the nodes for the workflow from the workflow definition collection
        nodes = workflows.find_one({'workflow-name': job['workflowName']})['nodesNecessary']
        # The address for each component, in order
        addressList = []
        
        startComponents(nodes, job['_id'], job['parameters'])
        
        # All components are running, update the collection
        job['state'] = 'working'
        job['addresses'] = addressList
        activeJobList.update_one({'_id':job['_id']}, {"$set": job}, upsert=False)
    
    
    # Check for finished jobs, remove them from the DB, and shutdown unused components
    cursor = activeJobList.find({'state': 'done'})
    for job in cursor:
        # Get the nodes for the workflow from the workflow definition collection
        nodes = workflows.find_one({'workflow-name': job['workflowName']})['nodesNecessary']
        
        # Shutdown the first component manually since it is unique
        shutdownComponent(job['componentAddresses'][0])
        
        # Decrement the degree for each component,
        # shut it down if this is the last workflow that used it (degree of 0)
        for name in nodes[1:]:
            # This should never be 'None', but just in case...
            comp = next((x for x in activeComponents if x['type']== name), None)
            if(comp != None):
                comp.degree -= 1
                if(comp.degree == 0):
                    shutdownComponent(comp.addr)
                    
    
    print("loop")
    
    if(True):
        break
    time.sleep(10)

