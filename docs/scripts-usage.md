# create_vm.sh
Will create VM image from supplied parameters.


Script parameters:
- `-n`: VM Name
- `-i`: Path to qcow2 image
- `-c`: Number of vCPUs
- `-m`: Amount of RAM in MB

Example:

```
sudo sh create_vm.sh -n myVM1 -i ./CentOS-7-x86_64-GenericCloud-2111.qcow2 -c 1 -m 2048
```
Output:
VM with login parameters:
Login: `root`
Password: `1234`

# create_static_ip_config.sh
Will generate `ifcfg` config file from supplied parameters.
This script should be used inside VMs to set a static IP Address for it

Script parameters:
- `-e` Ethernet Interface Name
- `-a` IP Address
- `-m` Prefix (Default: 24) (optional)
- `-g` Gateway

Example
```
sh create_static_ip_config.sh -e eth0 -a 192.168.1.100 -m 24 -g 192.168.1.1
```

Output: `ifcfg-eth0`
```
DEVICE="eth0"
BOOTPROTO="static"
ONBOOT="yes"
IPADDR=192.168.1.100
PREFIX=24
GATEWAY=192.168.1.1
TYPE="Ethernet"'
USERCTL="yes"
PEERDNS="yes"
IPV6INIT="no"
```

# Twitter_Data_Source.py
Will generate a text file containing the first 5 tweets acquired from the tweepy API matching the filter ```username = "john"```.
### TODO:
- Create a way to access John's API keys without exposing them publically.
- Determine exactly what needs to be output, and if that should be customizable (from CLI)
- Determine which filters to use, and if that should be customizable (from CLI)
