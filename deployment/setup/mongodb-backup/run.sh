MONGO_CONTAINER_NAME="$(kubectl get pods -o=name | grep mongodb | sed "s/^.\{4\}//")"
kubectl exec -i $MONGO_CONTAINER_NAME --  mongodump --uri="mongodb://admin:admin@mongodb-svc" --db=test --username=admin --password=admin  --port 27017  --authenticationDatabase=admin  --gzip --archive >  backup/mongodb_dump.gz
