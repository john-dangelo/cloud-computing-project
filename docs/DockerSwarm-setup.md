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
systemctl restart docker
```

# Create a Swarm
On **Manager node**
```
docker swarm init --advertise-addr $managernode_ip
```
I created a swarm on `10.176.67.100`, the command to join the swarm from other VMs is
```
docker swarm join \
    --token SWMTKN-1-0wfad3pueqf10w55bjp7m2v3p1zpznro5qi98mwi6bdvkbg98a-966r2n4rrq622ibiobpkbm7w5 \
    10.176.67.100:2377
```

## Retrieve lost token
```
docker swarm join-token manager -q
```

# Deploying service
On the Manager node, run the following command to launch a webserver service:
```
docker service create -p 80:80 --name webservice --replicas 2 httpd
```
The above command will create a service with name webservice and containers will be launched from docker image "httpd". containers are deployed across the cluster nodes such as, Managernode, Workernode1 and Workernode2.

Now, you can list and check the status of the service with the following command:

`docker service ls`