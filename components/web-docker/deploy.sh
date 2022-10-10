#!/bin/bash

tag=$1

docker build -t $tag . && docker tag $tag "managernode:5000/$tag" && docker push "managernode:5000/$tag"