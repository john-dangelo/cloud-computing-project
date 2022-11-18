import os
import time
import subprocess
from pymongo import MongoClient

# Connect to DB
client = MongoClient('mongodb://mongo1,mongo2,mongo3:27017/?replicaSet=rs1')
internalDB = client['workflow']

# Get collection
components = internalDB['component_definitions'] 

# Main working loop
while(True):
    
    # Get all the pending components that were uploaded
    cursor = components.find({'status': 'pending'})
    
    # Make and push their images
    for component in cursor:
        print("pending cursor")
        location = component['location']
        
        files = ""
        #for now there can only be one, but we might want to add more
        for file in component['included_files']:
            files += location+"/"+file
        
        #  add script to the top of the file
        dataflowWrapper = open("flask_wrapper.py","r")
        dataflowRawText = dataflowWrapper.read()
        dataflowWrapper.close()

        clientProgram = open(files, "r")
        clientProgramText = clientProgram.read()
        clientProgram.close()

        clientProgram = open(files,"w")
        clientProgram.write(
        "\n###########################################################################"+
        "\n##                        DATA FLOW WRAPPER SCRIPT                       ##" +
        "\n###########################################################################\n\n" + 
        dataflowRawText + 
        "\n\n###########################################################################"+
        "\n##                        END OF DATA FLOW WRAPPER                       ##" +
        "\n###########################################################################\n\n" + 
        clientProgramText)
        clientProgram.close()
        
        requirementsFile = open(location+"/requirement.txt","a")
        requirementsFile.write("\npymongo==4.3.2\nFlask==2.2.2\nrequests")
        requirementsFile.close()
        
        # print("calling command line")
        # command = component['component_name'].trim() + " "+ files.trim() + " "+ location.trim() +"/requirement.txt"
        # print('buildImage '+ command)
        # os.system('sh buildImage.sh '+command)
        # print('location', location)
        subprocess.call(['sh', 'buildImage.sh', component['component_name'], files, location+"/requirement.txt"])
        
        component['status'] = 'ready'
        components.update_one({'_id':component['_id']},{"$set":component},upsert=False)
                    
    
    print("check")
    time.sleep(5)