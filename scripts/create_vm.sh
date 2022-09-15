#!/bin/sh
n=''
cpu='1'
mem='2048'
img=''
verbose='false'

print_usage() {
  echo "Usage: \
  -n [VM_NAME] \
  -i [Image path] \
  -c [Number of vCPUs] \
  -m [Memory size] \
  "
}

while getopts ':n:c:m:i:v' flag; do
  case "${flag}" in
    n) name="${OPTARG}" ;;
    c) cpu="${OPTARG}" ;;
    m) mem="${OPTARG}" ;;
    i) img="${OPTARG}" ;;
    v) verbose='true' ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [[ $img == "" ]]
then
    echo "Please provide image PATH"
    print_usage
    exit 1
fi

if [[ $name == "" ]]
then
    echo "Please provide VM name"
    print_usage
    exit 1
fi

echo "Creating VM with: "
echo "Name: $name"
echo "CPUs: $cpu"
echo "Memory: $mem"
echo "Source image: $img"

new_img="$name.qcow2"
# make copy of original image
cp $img $new_img

virt-customize -a $new_img --root-password password:1234

virt-install --name $name \
--memory $mem \
--vcpus $cpu \
--disk $new_img,bus=sata \
--import --os-variant centos7.0 \
--network bridge:br0