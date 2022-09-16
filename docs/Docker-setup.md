# Install Docker Engines for each VM
Install the yum-utils package (which provides the yum-config-manager utility) and set up the repository.
```
sudo yum install -y yum-utils
```
```
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
Install the latest version of Docker Engine, containerd, and Docker Compose or go to the next step to install a specific version:
```
 sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```
If prompted to accept the GPG key, verify that the fingerprint matches 060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35, and if so, accept it.

Start Docker.

```
 sudo systemctl start docker
```

Verify that Docker Engine is installed correctly by running the hello-world image.

```
sudo docker run hello-world
```