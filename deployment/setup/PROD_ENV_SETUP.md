# Production Environment Setup Procedure
This guide is for basic production environment setup before deploying our web applications.

## Step 01: Install Kubernetes (K8S)

There are **_03 main components_** need to be installed in **one master node (control plane)** and **all worker nodes**:
1. Docker Runtime Engine
2. Container Runtime Interface (CRI)
3. Kubeadm, kubectl & kubelet

Please refer to the script [install_k8s.sh](./k8s/install_k8s.sh) for more details



## Step 02: Initiate a Cluster & Join Nodes

Pleas refer to the script [init_master.sh](./k8s/init_master.sh) for more details.

Basically, initiate the cluster steps by running below commands on the **Master Node**:
1. Turn off "swap" configuration by:
    - Temporary method:
    ```bash 
    $ sudo swapoff -a 
    ```
    - Permanent method: 
    ```bash
    $ sudo vi /etc/fstab
    #### Comment the swap line as below:
    #/swapfile none swap sw 0 0
    ```
2. Init the cluster:
    ```bash
    $ sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --cri-socket unix:///var/run/cri-dockerd.sock
    ### Wait until finished & run the following output commands from previous step:
    $ mkdir -p $HOME/.kube
    $ yes | sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    $ sudo chown $(id -u):$(id -g) $HOME/.kube/config
    ```
3. Deploy a pods networking:
    ```bash
    $ kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
    ```
4. Allow pods scheduled on the Master Node:
   ```bash
   $ kubectl taint nodes --all node-role.kubernetes.io/control-plane-
   ```
5. If you want to reset the cluster, refer to [reset_cluster.sh](./k8s/reset_cluster.sh)
   ```bash
   $ sudo kubeadm reset -f --cri-socket unix:///var/run/cri-dockerd.sock
   ```

Then, run the following on all **worker nodes**:
1. Also remember to turn off swap configuration
2. Join a node to the cluster:
    ```bash
    ### To get the above token, run the below command on the master node:
    $ kubeadm token create --print-join-command ## Run this on master
    
    # Then run this on all worker nodes
    $ sudo kubeadm join 192.168.2.18:6443 --token regfmr.a4qbvicng9ln29wl \
 	--discovery-token-ca-cert-hash sha256:6a44703f6871c755b06362ad2204d091cdc8073f3e2647e6c3deaac9872ed890    
    ```

## Step 03: Set Static IP Addresses for Master Node and All Worker Nodes

Please see [00-installer-config.yaml](./networking/static_ip_netplan/00-installer-config.yaml) for more details.

Using "**netplan**" utility to configure static IP addresses. Basic steps:
- Step #1: Get Ethernet interfaces (LAN)
    ```bash
        $ ifconfig
        ##### the interfaces look like: eth0, enp2s0...
    ```
- Step #2: Edit the configuration file as the example file: **"[/etc/netplan/00-installer-config.yaml](./networking/static_ip_netplan/00-installer-config.yaml)"**
    ```bash
        $ sudo cp /etc/netplan/00-installer-config.yaml /etc/netplan/00-installer-config.yaml.original
        $ sudo nano /etc/netplan/00-installer-config.yaml
        ##### Edit the file as the example file
        $ sudo netplan try
    ```


## Step 04: Set Up A Local DNS and Customer Domain Names For Webserver and APIHost

Using a lightweight DNS service, which is "dnsmasq"
- Step #1: Install dnsmasq service
  ```bash
    $ sudo apt-get update
    $ sudo apt-get install dnsmasq
  ```
- Step #2: Configure dnsmasq by editing the config as the example file: **"[/etc/dnsmasq.conf](./networking/local_dns/dnsmasq.conf)"**
  ```bash
    $ sudo cp /etc/dnsmasq.conf /etc/dnsmasq.conf.original
    $ sudo nano /etc/dnsmasq.conf
    ##### Edit the file as the example
    $ sudo systemctl restart dnsmasq.service
    $ sudo systemctl status dnsmasq.service
  ```
If we have multiple DNS services running on the same PC. We will get the errors resulted from using the same port 53. Please see the [**fix here**](./networking/local_dns/FIX_DNS.md)

## Step 05: Redirect Our Custom Domain Name URL to Our Webserver Port 30000 in K8S Cluster

Assumption: Apache2 webserver is running on the Production server.
Install Apache2:
```bash
$ sudo apt update
$ sudo apt install apache2
$ sudo systemctl status apache2

```
- Step #1: **Enable mod_proxy**
    ```bash
    $ sudo a2enmod proxy 
    $ sudo a2enmod proxy_http 
    $   
    ```
- Step #2: Configure **"ProxyPass"** for Apache
Edit our Apache configration as the example file: **"[/etc/apache2/sites-available/000-default.conf](./networking/local_dns/000-default.conf)"**

    ```yaml
        <VirtualHost *:80> 
            ServerName yourdomain.com 
            
            # ... Other configuration ... 

            ProxyPass /app http://backend-server:8080/ 
            ProxyPassReverse /app http://backend-server:8080/ 
        </VirtualHost>
    ```
For more details, see the example file [000-default.conf](./networking/local_dns/000-default.conf)


## Step 06: Configure the main local router


This step is very specific to each router brand. However, there are 02 basic steps:
- Configure the static primary DNS IP
- Add routing to that IP


## Step 07: Setup NFS server on the Master Node



