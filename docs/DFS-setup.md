Reference: https://thenewstack.io/tutorial-create-a-docker-swarm-with-persistent-storage-using-glusterfs/

# Prerequisite
- All VM nodes initialized and joined Docker Swarm with custom hostname (managernode, workernode1, workernode2,...)
- GlusterFS installed on all node
```
sudo yum search centos-release-gluster

sudo yum install centos-release-gluster9 -y
sudo yum install glusterfs gluster-cli glusterfs-libs glusterfs-server -y
```

# Enable GlusterFS service

```
sudo systemctl start glusterd
sudo systemctl enable glusterd

```

# Add firewall port for glusterFS service
```
sudo firewall-cmd --permanent --add-port=24007-24008/tcp
sudo firewall-cmd --permanent --add-port=49152-49160/tcp

sudo firewall-cmd --reload

```

# Probing the nodes
From managernode, do
```
sudo gluster peer probe workernode1
sudo gluster peer probe workernode2
sudo gluster peer probe workernode3
sudo gluster peer probe workernode4
sudo gluster peer probe workernode5

```
after probing the nodes, we should have the following result after running `sudo gluster pool list`
```
[generic@managernode ~]$ sudo gluster pool list
UUID                                    Hostname        State
89b02396-e539-448a-a835-ba6fb5cc0b60    workernode1     Connected
94dbf41a-fff9-479f-ad3f-0d3b60c91ccf    workernode2     Connected
6955447d-4550-4b87-8724-36611c022548    workernode3     Connected
4fdc9411-ffd9-4ed3-a089-c7a42e9d1834    workernode4     Connected
e2aada05-2bd4-4cba-b2ec-f2f64d19a87b    workernode5     Connected
32d899b8-3758-41ed-8291-8ba9125f8906    localhost       Connected

```

# Create DFS volume
On ALL VM nodes created by UTD
```
sudo mkdir -p /home/gluster/dfsvolume
```
On ALL VM nodes on Physical Machine
```
sudo mkdir -p /gluster/dfsvolume
```

## Register the created volume accross cluster
Volume name: `my-dfs`
From managernode, do
```
sudo gluster volume create my-dfs replica 6 managernode:/home/gluster/dfsvolume workernode1:/home/gluster/dfsvolume workernode2:/gluster/dfsvolume workernode3:/gluster/dfsvolume workernode4:/gluster/dfsvolume workernode5:/gluster/dfsvolume force
```

Start the volume
```
sudo gluster volume start my-dfs
```

## Make sure the volumes will mount on a reboot

On ALL nodes
mount `my-dfs` to `/mnt`
```
sudo -s

echo 'localhost:/my-dfs /mnt glusterfs defaults,_netdev,backupvolfile-server=localhost 0 0' >> /etc/fstab

umount /mnt

mount.glusterfs localhost:/my-dfs /mnt

exit
```

Now we have a shared directory at `/mnt` on all nodes