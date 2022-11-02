# Docker Swarm
When running on Docker Swarm mode, Docker manages placement of the services. On ANY nodes, we can access the
service by its ports only.
For example:
- Webservice container is running on workernode5 (10.176.67.212) at port 80
- Docker Swarm lets us access webservice on ANY node in the swarm, so
we can access the web page at: http://10.176.67.100:80 http://10.176.67.101:80 http://10.176.67.209:80 http://10.176.67.210:80 http://10.176.67.211:80 http://10.176.67.212:80
- Similarly, we can send REST message to the service by sending it to IP_ADDRESS:PORT or HOSTNAME:PORT
- Example: if the service X is running and exposes port 1234, we can send message to it by POST http://managernode:1234 (or workernode1/workernode2/workernode3/workernode4/workernode5)

# /components/docker-compose.yml
This is the file that describes our services with its docker images, port mapping, constraints, etc...

# Create Docker images and upload to the Registry
The Registry is crucial since it provide a place for other nodes to pull the images to run

When creating Docker images, we need to publish those images to our local registry, in this case, run
```
sudo docker tag myimage managernode:5000/myimage
```
after image creation

Push the newly created image to the registry
```
sudo docker push managernode:5000/myimage
```

# Deploy our services
On manager node (10.176.67.100)
Clone our github project, then navigate to `/components`

To deploy our entire stack of services, run

```
sudo docker stack deploy -c docker-compose.yml internaldb
```

run `sudo docker service ls` to check the status of the services

```
[generic@managernode components]$ sudo docker service ls
ID             NAME                       MODE         REPLICAS   IMAGE                               PORTS
at7mph8sgz33   internaldb_mongo1          replicated   1/1        mongo:latest                        *:27017->27017/tcp
ysay2ocbrwmd   internaldb_mongo2          replicated   1/1        mongo:latest
6kjrm0fjs6vc   internaldb_mongo3          replicated   1/1        mongo:latest
dwpacxe3coqi   internaldb_mongo-express   replicated   1/1        mongo-express:latest                *:8081->8081/tcp
uew6s66bqko9   internaldb_webservice      replicated   1/1        managernode:5000/webservice:1.0.2   *:80->3000/tcp
it38bvvwcnfm   registry                   replicated   1/1        registry:2                          *:5000->5000/tcp
```