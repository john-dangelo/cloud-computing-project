# Prerequisites
- Have multiple VMs working and can ping each other
Reference: https://www.alibabacloud.com/blog/how-to-install-and-configure-docker-swarm-mode-on-centos-7_583495
# Add to /etc/hosts for each VMs

```
10.176.67.100 managernode
10.176.67.101 workernode1
```

# For each VM, set host name according to /etc/hosts
Managernode
`hostnamectl set-hostname managernode`
Workernode1
`hostnamectl set-hostname workernode1`

# Install `firewalld` 

```
sudo yum install firewalld
```
```
sudo systemctl enable firewalld
sudo reboot
```
# Next, you will need to open ports 7946, 4789, 2376, 2377 and 80 on the firewall for a swarm cluster to work properly.

Run the following command on all the nodes:

```
sudo firewall-cmd --permanent --add-port=2376/tcp
sudo firewall-cmd --permanent --add-port=2377/tcp
sudo firewall-cmd --permanent --add-port=7946/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=7946/udp
sudo firewall-cmd --permanent --add-port=4789/udp
```

Restart Docker and Firewall to apply the changes
```
sudo firewall-cmd --reload
sudo systemctl restart docker
```

# Create a Swarm
On **Manager node**
```
docker swarm init --advertise-addr $managernode_ip
```
I created a swarm on `10.176.67.100`, the command to join the swarm from other VMs is
```
docker swarm join \
    --token SWMTKN-1-0eu07xmftle64fxurf759kyh1csd5jqmbzs88d4fc1x4md09an-1esl0z251thz8u17xff2lw62t \
    10.176.67.100:2377
```

## Retrieve lost token
```
docker swarm join-token manager -q
```

# Deploying service

## Create Docker Registry for our local images
This is crucial since other nodes need to be able to pull the Docker Images and start containers by themselves.
We configure to let the `Manager Node` hold the registry, on Manager Node, run:
```
sudo docker service create --name registry --publish 5000:5000 registry:2
```

Make the registry expose HTTP protocol
```
sudo vi /etc/docker/daemon.json 
```
Replace it with
```
{ "insecure-registries":["${MANAGER_NODE_IP}:5000"] } 
```
In our case
```
{ "insecure-registries":["managernode:5000"] } 
```

Restart docker service
```
sudo service docker restart
```
Now the registry is available at `${MANAGER_NODE_IP}:5000` or `managernode:5000`.

## Create and Publish Docker Images to Registry
I have added the `webservice` docker images on Manager node:
`webservice` images expose the web page on port 3000, we need to map port 80 from the host to port 3000 of the container to have a web page running on the default HTTP port 80.

When creating Docker images, we need to publish those images to our local registry, in this case, run
```
sudo docker tag myimage ${MANAGER_NODE_IP}:5000/myimage
```
after image creation

Push the newly created image to the registry
```
sudo docker push managernode:5000/webservice
```
## Create swarm service
If you create the docker images in the manager node, you need to provide the exact path to that 
In order to create this service, run
```
sudo docker service create -p 80:3000 --name webservice --replicas 2 ${MANAGER_NODE_IP}:5000/webservice
```
```
sudo docker service create -p 80:3000 --name webservice --replicas 2 managernode:5000/webservice
```

The above command will create a service with name webservice and containers will be launched from docker image "webservice". containers are deployed across the cluster nodes such as, Managernode, Workernode1 and Workernode2.

Now, you can list and check the status of the service with the following command:

`docker service ls`