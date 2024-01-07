# hgtp_management_app
HGTP's management web application

## Works need to improve
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