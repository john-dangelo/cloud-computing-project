# -*- coding: utf-8 -*-
"""
Workflow Flask Endpoint

New plan is to have WF Manager just read DB for 'pending' jobs, no receiving
via flask.

The job of this script is to recieve the POST requests from the client
web-front to create new jobs (workflows).  After receiving a POST this script
adds an entry to the master_jobs DB with a job id and the type of workflow, but
no related component data.  The Workflow Manager will poll this DB and look for
'pending start' jobs to assign component info and begin work.

Created on Fri Sep 30 16:26:19 2022
@author: John DAngelo
"""

from flask import Flask, request, jsonify

app = Flask(__name__)

def send(data):
    #lookup next addr
    #if no next addr, either do nothing or update entry in db
    
def func(data):
    #do work on data
    #return what we want to send

# Can grab form data, JSON data, or raw strings
@app.route('/', methods=['POST'])
def parse_request():
    # All the data from the url and html
    data = request.values
    print('hello')
    
    out = func(data)
    send(out)
    
    return "hi"
    
    # Determine which workflow is being requested to start
    #add correct workflow to main job list DB, specify 'unstarted/todo'

# Can be used in the same way as above?
@app.after_request
def after_request_func(response):
    print("after_request")
    return response

