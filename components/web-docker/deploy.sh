#!/bin/bash

tag=$0

docker build -t $tag . && docker tag $tag "managernode:5000/$tag" && docker push "managernode:5000/$tag"