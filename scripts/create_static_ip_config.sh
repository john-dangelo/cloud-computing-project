#!bin/sh

name=''
eth_name=''
address=''
mask='24'
gateway=''
verbose='false'

print_usage() {
  echo "Usage: \
  -e [Ethernet Interface Name]
  -a [IP Address] \
  -m [Prefix (Default: 24)] \
  -g [Gateway] \
  "
}

while getopts ':e:a:m:g:v' flag; do
  case "${flag}" in
    e) eth_name="${OPTARG}" ;;
    a) address="${OPTARG}" ;;
    m) mask="${OPTARG}" ;;
    g) gateway="${OPTARG}" ;;
    v) verbose='true' ;;
    *) print_usage
       exit 1 ;;
  esac
done

## input check
if [[ $eth_name == "" ]]
then
    echo "Please provide ethernet interface name"
    print_usage
    exit 1
fi

if [[ $address == "" ]]
then
    echo "Please provide IP Address"
    print_usage
    exit 1
fi

if [[ $gateway == "" ]]
then
    echo "Please provide Gateway"
    print_usage
    exit 1
fi

cat > ifcfg-${eth_name} <<EOL
DEVICE="$eth_name"
BOOTPROTO="static"
ONBOOT="yes"
IPADDR=${address}
PREFIX=${mask}
GATEWAY=${gateway}
TYPE="Ethernet"' 
USERCTL="yes"
PEERDNS="yes"
IPV6INIT="no"
EOL