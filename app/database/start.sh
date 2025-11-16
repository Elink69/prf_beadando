#!/bin/sh
set -e

echo "Restoring Mongo dump..."
mongod --fork --logpath /var/log/mongod.log --bind_ip_all
mongorestore --drop /dump
mongod --shutdown


exec mongod --bind_ip_all