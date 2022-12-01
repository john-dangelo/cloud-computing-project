#!/bin/bash
#COMMAND LINE ARGS
# buildImage [component name] [file location] [requirements location]
#
#EXAMPLE (this is the default if no arguments are given)
# buildAndRun twitter-scrape /mnt/scripts/twds /mnt/scripts/requirements.txt
#
#Build docker file
#Pre-copy scripts
COMPONENT_NAME=component.py;
cp $2 ./$COMPONENT_NAME;
cp $3 ./requirement.txt;
# chmod 775 -R ./;
echo FROM python:latest > dockerfile;
echo LABEL Maintainer="compManager" >> dockerfile;
echo WORKDIR /usr/app/src >> dockerfile;
echo COPY $COMPONENT_NAME . >> dockerfile;
echo COPY requirement.txt . >> dockerfile;
echo COPY flask_wrapper.py . >> dockerfile;
echo RUN pip install -r ./requirement.txt >> dockerfile;
echo "RUN apt update -y && apt install net-tools -y" >> dockerfile;
echo "RUN apt install iputils-ping -y" >> dockerfile;
echo EXPOSE 8000 >> dockerfile;
#Build Image
sudo docker image build -t $1:latest .;
#Rename image
sudo docker image tag $1:latest $1:latest;
#Push to image registry
sudo docker push $1:latest;