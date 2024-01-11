# HGTP Management Applications
HGTP's management web application

## Basic Local Setup for Development
> Don't be upset or frustrated if you get many errors. =)) You are not alone!

- Step #1: **Install** the Kubernetes and  on the local machine. Please refer to [this document](https://github.com/DavidDaoTu/docker_k8s_training/blob/main/k8s_deployment/NOTES.md). Basically, run the following script [install_k8s.sh](https://github.com/DavidDaoTu/docker_k8s_training/blob/main/k8s_deployment/k8s_installation_init_cluster/install_k8s.sh)



- Step #2: **Initialize** the Control Plane on the master node. Run the following script [init_master.sh](https://github.com/DavidDaoTu/docker_k8s_training/blob/main/k8s_deployment/k8s_installation_init_cluster/init_master.sh)



- Step #3: Go to the folder "[deployment](./deployment/)" and run he following commands to deploy our application on the cluster
```bash
$ kubectl get nodes
# Output should look like following: (If not, we need to fix errors: such as run $ sudo swapoff -a)
# ----
# NAME                         STATUS   ROLES           AGE     VERSION
# tudao-ideapad-5-pro-14iap7   Ready    control-plane   7d12h   v1.29.0
$ kubectl get pods
# Apply all YAML files. This should have an error for the first time, because of lacking Docker images.
$ kubectl apply -f . 
#### or to apply a specific deployment YAML file. See:
# $ kubectl apply -f frontend_deployment.yaml
```


- Step #4: Comeback to the **root/parent project folder**. Using docker compose to build our application images.
```bash
$ docker image prune --all #delete all unsed images
$ docker images
# build apps images (local repo only, we will push to Docker hub repo later)
$ docker compose -f docker-compose-build.yaml build --parallel

###### Use the below command to update new Docker images for K8S deployments
$ kubectl rollout restart deployment hgtp-backend hgtp-frontend reverse-proxy
```
   Go to the step #3 to apply our deployments file then go to the next step to debbug pods/deployments/volumes...


   
- Step #5: Troubleshooting/Debugging:
```bash
# Get all deployments, pods, service
$ kubectl get deployments -o wide
$ kubectl get pods -o wide
$ kubectl get svc -o wide

# Describe pods configurations;
$ kubectl describe pods
# Describe service to check port mappings of deployments
$ kubectl describe svc

# Get live logs of pods
$ kubectl get pods
$ kubectl logs -f kubectl logs -f hgtp-frontend-5989dcf458-rs6fj

# Get all persistent volumes (PV) & describe the PV info
$ kubectl get pv -o wide
$ kubectl describe pv 
## The same commands for persistent volume claim (PVC), configmap, secret
$ kubectl get pvc -o wide
$ kubectl describe pvc

#####
# Get a Shell access to pods
$ kubectl get pods
$ kubectl exec -it  hgtp-frontend-685f747576-nvftd -- /bin/sh 

```
> Note: Currently, we use ".env" file and build it with hgtp_frontend image. So, please create a file ".env" in hgtp_frontend with the following content:
```bash
# .env file in hgtp_frontend. Build Docker frontend image
# This is not a good practice. We will solve this later
# If we have a domain
# REACT_APP_BASE_URL=http://hostapi.hgtp.net:30080/api 
# If not
REACT_APP_BASE_URL=http://localhost:30080/api 
REACT_APP_CLOUDINARY_URL= 
REACT_APP_CLOUDINARY_PRESET=
```

- Step #6: Access the web app
```bash
$ kubectl get svc
## Output looks like:
# NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
# backend-svc     ClusterIP   10.111.13.52     <none>        8080/TCP         4d1h
# frontend-svc    NodePort    10.101.176.60    <none>        80:30000/TCP     4d1h
# kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP          7d13h
# mongodb-svc     ClusterIP   None             <none>        27017/TCP        4d1h
# reverse-proxy   NodePort    10.108.211.202   <none>        8080:30080/TCP   4d1h
```
   Open browser & access to: http://localhost:30000/

- Step #7: Import the Mongodb's json for database seeding.
  
  + Install the MongoDB Compass GUI: https://www.mongodb.com/products/tools/compass
  
  + Then, run the following commands:
```bash
$ kubectl get svc
$ kubectl port-forward service/mongodb-svc 28015:27017 &
```
   Open Compass GUI & see [the guideline](https://github.com/DavidDaoTu/docker_k8s_training/blob/main/k8s_deployment/NOTES.md#2-run-a-stateful-applications-using-a-deployment)

## Works need to improve in future
### I. Front-End
1. Stop moving image on the landing page
2. Chua co responsive ---> @media
3. Chuc nang: 
        + thong bao
        + search theo "lo"
4. Technologies framework:
   + React/VueJS
   + NodeJS Cloudinary (?)
5. Thieu
   + log: front-end, backend?
   + unittest?
   + refactor

### II. Back-End 
1. xac thuc, phan quyen: 
   + hien nay: server generate jwt cookie --> 
   + phan quyen: 
2. microservices on AWS ? --> how to ? EKS
3. CI/CD: 
   + CI: travis.ci/circleci/jenkins --> build docker file --> docker imgage --> docker push Dockerhub (image registry)
   + CD: Kéo Docker imgage từ Dockerhub --> cấp phát tài nguyên tren cloud --> deploy 
4. logs --> cloudwatch (aws)
5. security --> How to store username & password in DB?
6. Web static hosting, Domain name system (DNS) & content delivery network (CDN)
   + S3, Rout53
7. Serverless

### IV. Databases Solutions
1. MongoDB localhost/on-premise ?
   - How to seed the DB by code?
     + Connection string format: https://www.mongodb.com/docs/v3.0/reference/connection-string/#standard-connection-string-format
     + Manually seed by "mongosh": 
       - If MongoDB is running on Docker, make sure mongosh container is on the same network with mongodb container:
       
         ```bash 
         $ docker run --rm --name mongosh --network hgtp_management_app_express-mongodb -it mongodb/mongodb-community-server:6.0.8-ubi8 mongosh "mongodb://user:pass@mongodb"
         $ show dbs
         $ use test
         $ show collections
         $ db.users.insertOne({"username":"admin", "password":"admin", "role":"admin", "name":"admin"})
         ```
       
       - If MongoDB is running on Kubernetes (K8S), with a service named "mongodb-svc":
         ```bash
         $ kubectl get pods
         $ kubectl get svc
         $ kubectl run -it --rm --image=mongodb/mongodb-community-server:6.0.8-ubi8 --restart=Never mongosh -- mongosh "mongodb://admin:admin@mongodb-svc"
         $ show dbs
         $ use test
         $ show collections
         $ db.users.insertOne({"username":"admin", "password":"admin", "role":"admin", "name":"admin"})
       
         ```
   - How to manipulate the DB? (manually? from code): 
     - https://www.mongodb.com/developer/products/mongodb/cheat-sheet/
     - https://www.tutorialspoint.com/mongodb/mongodb_query_document.htm
   - Use MongoDB running on Docker with mounted volumes & periodic backup/sync to Google Drive (freeaccount or paid account)

      + https://www.mongodb.com/compatibility/docker

   - How to backup? What is best practice for mongodb docker instance?

   - How to setting up the persistent volumes: (kubernetes)
   - How to manage the MongoDB in container such as config, create or add user?
   - How to monitor the MongoDB health, resource comsumption?
   - How to increase performance? (read replicas)
   - How to make DB more availability, resilience? 

2. Database on AWS Cloud?


### V. File Storage Solutions
1. GG Drive

mount: 
- volume, 
- binding..

2. AWS S3


### VI. Microservices Architecture Design
1. what services? why need?
2. Nginx configuration?



### VII. Continuous Integration & Continuous Deployment (CI/CD)
1. TravisCI, Jenkins CI, CircleCI....
2. On-premise Kubernetes
3. AWS EKS?


### VIII. Testing
1. Unit Tests
2. Black & graybox test
3. Stress Tests
4. Security Tests



### IX. Documentation
1. High-level (architecture) design
2. Application notes
3. User guide, manual

### X. Delivery, Maintainance & Customer Support
1. HW infrastructure & SW environment setup
2. Operation guide, Demos
3. Maintainence & customer support