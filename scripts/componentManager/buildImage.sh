#!/bin/bash
#COMMAND LINE ARGS
# buildImage [component name] [file location] [requirements location]
#
#EXAMPLE (this is the default if no arguments are given)
# buildAndRun twitter-scrape /mnt/scripts/twds /mnt/scripts/requirements.txt
#
#Build docker file
#Pre-copy scripts
cp $2 ./temp.py;
cp $3 ./requirement.txt;
# chmod 775 -R ./;
echo FROM python:latest > dockerfile;
echo LABEL Maintainer="compManager" >> dockerfile;
echo WORKDIR /usr/app/src >> dockerfile;
echo COPY temp.py . >> dockerfile;
echo COPY requirement.txt . >> dockerfile;
echo RUN pip install -r ./requirement.txt >> dockerfile;
#Build Image
sudo docker image build -t $1:latest .;
#Rename image
sudo docker image tag $1:latest $1:latest;
#Push to image registry
sudo docker push $1:latest;