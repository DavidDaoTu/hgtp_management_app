# hgtp_management_app
HGTP's management web application


## Works need to improve
### I. Front-End
1. Stop moving image on the landing page
2. Chua co responsive ---> @media
3. chuc nang: 
        + thong bao
        + search theo "lo"
4. cong nghe:
   + react
   + cloudinary (?)
5. Thieu
   + log: front-end?
   + unittest?
   + refactor

### II. Back-End: 
1. xac thuc, phan quyen: 
   + hien nay: server generate jwt cookie --> 
   + phan quyen: 
2. microservices on AWS ? --> how to ?
3. CI/CD: 
   + CI: travis.ci/circleci/jenkins --> build docker file --> docker imgage --> docker push Dockerhub (image registry)
   + CD: Kéo Docker imgage từ Dockerhub --> cấp phát tài nguyên tren cloud --> deploy 
4. logs --> cloudwatch (aws)
5. security --> 
   + web static: S3, CDN
   + EKS

### IV. Databases
1. MongoDB localhost/on-premise ?
- Use MongoDB running on Docker with mounted volumes & periodic backup/sync to Google Drive (freeaccount or paid account)

   + https://www.mongodb.com/compatibility/docker

- How to backup? What is best practice for mongodb docker instance?

- How to setting up the persistent volumes: (kubernetes)
- How to manage the MongoDB in container such as config, create or add user?
- How to monitor the MongoDB health, resource comsumption?
- How to increase performance? (read replicas)
- How to make DB more availability, resilience? 

2. Database on AWS Cloud?




### V. File Storage
1. GG Drive




2. AWS S3




### VI. Microservices architecture

1. what services? why need?
2. Nginx configuration?



### VII. Deployment
1. Kubernetes


2. AWS EKS?


