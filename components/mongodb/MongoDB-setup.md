ON manager node
```
sudo firewall-cmd --permanent --add-port=8081/tcp

```

ON each nodes
```
sudo firewall-cmd --permanent --add-port=27017/tcp

```

```
sudo docker node update --label-add mongo.replica=1 managernode
sudo docker node update --label-add mongo.replica=2 workernode1
sudo docker node update --label-add mongo.replica=3 workernode2
```

```
sudo docker stack deploy -c docker-compose-internaldb internaldb
```

```
sudo docker service update --publish-rm 27017:27017 internaldb_mongo1
sudo sh ./initiate
sudo docker service update --publish-add 27017:27017 internaldb_mongo1
```