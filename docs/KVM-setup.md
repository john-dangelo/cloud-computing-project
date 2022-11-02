# SETUP Network

Reference: https://linuxconfig.org/how-to-use-bridged-networking-with-libvirt-and-kvm
## Check VM compatibility

```
grep -e 'vmx' /proc/cpuinfo		#Intel systems
grep -e 'svm' /proc/cpuinfo		#AMD systems
```
```
lsmod | grep kvm
```

## Setup Cockpit (optional)

```
yum install cockpit cockpit-machines
```
Enable start with boot
```
systemctl start cockpit.socket
systemctl enable cockpit.socket
systemctl status cockpit.socket
```
Add firewall exception
```
firewall-cmd --add-service=cockpit --permanent
firewall-cmd --reload
```

We can now access COCKPIT interface at https://SERVER_IP:9090/

## Install virtualization libraries
```
yum install qemu-kvm qemu-img virt-manager libvirt libvirt-python libvirt-client virt-install virt-viewer bridge-utils libguestfs-tools
```

## Create bridge network
```
sudo ip link add br0 type bridge
```

### Modify file /etc/sysconfig/network-scripts/ifcfg-br0

```
DEVICE=br0
TYPE=Bridge
BOOTPROTO=dhcp
ONBOOT=yes
DELAY=0
NM_CONTROLLED=0
```

### Modify file /etc/sysconfig/network-scripts/ifcfg-$ETH_NAME

```
NAME=em1
DEVICE=em1
ONBOOT=yes
NETBOOT=yes
BRIDGE=br0
UUID=a2801e87-f289-4520-9534-9faabd765418
IPV6INIT=no
BOOTPROTO=dhcp
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
IPV4_FAILURE_FATAL=no
```

```
sudo systemctl enable --now network
```

## Disable netfilter

### Create file at `/etc/sysctl.d/99-netfilter-bridge.conf`
```
sudo vi /etc/sysctl.d/99-netfilter-bridge.conf
```
with content
```
net.bridge.bridge-nf-call-ip6tables = 0
net.bridge.bridge-nf-call-iptables = 0
net.bridge.bridge-nf-call-arptables = 0
```

### Check if `br_netfilter` module exists

```
sudo modprobe br_netfilter
```

### Create file at `/etc/modules-load.d/br_netfilter.conf` 

```
sudo vi /etc/modules-load.d/br_netfilter.conf
```
with content
```
br_netfilter
```

### Load netfilter config

```
sudo sysctl -p /etc/sysctl.d/99-netfilter-bridge.conf
```

## Create a new virtual network

### Create config file
```
sudo vi bridged-network.xml
```
with content
```
<network>
    <name>bridged-network</name>
    <forward mode="bridge" />
    <bridge name="br0" />
</network>
```

### Add config into `virsh`

```
sudo virsh net-define bridged-network.xml
```

### Start and set auto-start network
```
sudo virsh net-start bridged-network
sudo virsh net-autostart bridged-network
```

# SETUP Virtual Machines
References: 

- https://ostechnix.com/create-a-kvm-virtual-machine-using-qcow2-image-in-linux/ 
- https://qemu.readthedocs.io/en/latest/system/images.html


We can create from pre-installed images or from scratch

# Change `qemu` user to `generic`

```
sudo vi /etc/libvirt/qemu.conf  
```

Change `user = "root"` to `user = "generic"`

```
sudo systemctl restart libvirtd
```
## Create VN from image
Download image from: https://cloud.centos.org/centos/7/images/

Direct link to image: https://cloud.centos.org/centos/7/images/CentOS-7-x86_64-GenericCloud-2111.qcow2


Using script `create_vm.sh` under `/scripts`
```
sudo sh create_vm.sh -n myVM1 -i ./CentOS-7-x86_64-GenericCloud-2111.qcow2 -c 1 -m 2048
```

Script parameters:
- `-n`: VM Name
- `-i`: Path to qcow2 image
- `-c`: Number of vCPUs
- `-m`: Amount of RAM in MB

## Create VM from scratch
Reference: https://unix.stackexchange.com/questions/309788/how-to-create-a-vm-from-scratch-with-virsh

VM parameters explanation:
VM parameters explanation:
- Name: `MyVM1`
- Memory: `2048` MB
- Num. CPU: `1`
- Disk path: `myimage.qcow2`
- Connect to `bridge:br0`
- Using CentOS 7 ROM at `centos7.iso` (need to download CentOS7 iso)

```
sudo virt-install \
-n MyVM1 \
--description "Test VM with CentOS 7" \
--os-type=Linux \
--os-variant=centos7.0 \
--ram=2048 \
--vcpus=1 \
--disk path=./myimage.qcow2,bus=virtio \
--graphics none \
--cdrom ./centos7.iso \
--network bridge:br0
```

## Set STATIC IP address for each VM

`ETH_NAME=eth0`

INSIDE a VM do:

### Modify content of network script at /etc/sysconfig/network-scripts/ifcfg-$ETH_NAME

```
sudo vi /etc/sysconfig/network-scripts/ifcfg-$ETH_NAME
```
Add or modify these lines into
```
BOOTPROTO=static
IPADDR=xxx.xxx.xxx.xxx
NETMASK=255.255.255.0
GATEWAY=xxx.xxx.xxx.xxx
```

Restart network service
```
sudo systemctl restart network
```

Using `create_static_ip_config` script:
- Copy `create_static_ip_config.sh` into VM
- Create config file
```
sh create_static_ip_config.sh -e eth0 -a 192.168.1.102 -g 192.168.1.100
```
- Copy config file into network-scripts
```
sudo cp ifcfg-eth0 /etc/sysconfig/network-scripts/
```
- Restart network services
```
systemctl restart network
```


# COMMONLY USED COMMANDS

## View the list of available VM
`sudo virsh list --all`

## Shutdown VM
`sudo virsh shutdown vm_name`

## Delete VM
`sudo virsh undefine vm_name`

## View the list of available VMM network
`sudo virsh net-list`

## View info of a VM Disk image
`qemu-img info vm_disk`

## Customize base Cloud image with OS

```
virt-customize -a CentOS-7-x86_64-GenericCloud-2111.qcow2 --root-password password:1234
```
## Create VM Disk Images (no OS installed)

Create a RAW disk format with 10G max size with dynamic allocation
```
qemu-img create -f raw -o preallocation=off myimage.img 10G 
```

Create a QCOW2 disk format with 10G max size with dynamic allocation
```
qemu-img create -f qcow2 -o preallocation=off myimage.qcow2 10G 
```

## Enable Virt Manager GUI access on MobaXterm
```
sudo xauth add $(xauth -f ~generic/.Xauthority list|tail -1)
```

## Extend root partition
On created VM and extended with command
```
qemu-img resize disk.qcow2 +50G
```
```
fdisk /dev/sda
```
you will get
```
   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048    16777215     8387584   83  Linux
```

Issue `n` to create a new partition
Press Enter 4 times to use default values (to the end of disk)
```
Partition number (2-4, default 2): 2
First sector (16777216-121634815, default 16777216):
Using default value 16777216
Last sector, +sectors or +size{K,M,G} (16777216-121634815, default 121634815):
Using default value 121634815
```
Issue `w` to write new partition table
Reboot
```
mkfs.ext4 /dev/sda2
```
Mount newly created partition to /gluster
```
mount /dev/sda2 /gluster
```
