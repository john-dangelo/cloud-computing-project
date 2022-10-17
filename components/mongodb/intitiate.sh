#!/bin/bash
echo "Intializing replica set on master"
setdfrwconcert="db.adminCommand({\"setDefaultRWConcern\":1,\"defaultWriteConcern\":{\"w\":1}})"
replicate="rs.initiate(); sleep(1000); cfg = rs.conf(); cfg.members[0].host = \"mongo1:27017\"; rs.reconfig(cfg); rs.add({ host: \"mongo2:27017\", priority: 1 }); rs.addArb(\"mongo3:27017\"); rs.status();"
docker exec -it $(docker ps -qf label=com.docker.swarm.service.name=internaldb_mongo1) bash -c "echo '${setdfrwconcert}' | mongosh"
docker exec -it $(docker ps -qf label=com.docker.swarm.service.name=internaldb_mongo1) bash -c "echo '${replicate}' | mongosh"