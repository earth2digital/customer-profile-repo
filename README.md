## Overview
This is a nodeJS customer profile repo to demo E2E Architecture Design for customer profile API. This API returns the customer profile details from AWS DynamoDB database. 

To get a copy of this repo
```
git clone git@github.com:earth2software/customer-profile-repo
```
to commit and push your changes
```
git add -A
git commit -am "commit message, please write clearly the updates you have done as part of the commit"
git push
```

## .env file
.env file is used by NodeJS code to set configuration inside the API app. 

## AWS CodeDeploy
If you will use AWS CodeDeploy to deploy the App/API to AWS EC2 resources. AWS CodeDeploy uses below files to manage deployment:

- appspec.yml
- scripts/stop_server
- scripts/remove_existing_files
- scripts/install_dependencies
- scripts/start_server

AWS CodeDeploy monitors this repository and if any changes happens, the code gets checked out and deployed to dev first. 

## Docker on AWS ECS
If you will use Docker, Dockerfile is the file used to build docker image
```
sudo docker build --tag="earth2/customer-profile-app:v1.0.0" {directory_where_your_files_are}

add docker run command
```

## Install
to install it on a machine you need to issues the below commands (All commands has to be executed as root or using sudo):
scripts/install_dependencies
```
#!/bin/bash
cd /home/ec2-user/express-service
curl -sL https://rpm.nodesource.com/setup_8.x | bash -
yum install -y nodejs
npm install forever -g
npm install
```
you need to have the .env file under /home/ubuntu/workspace
## Start API/App
scripts/start_server (All commands has to be executed as root or using sudo)
```
#!/bin/bash
cd /home/ec2-user/express-service
export PORT=80
forever start -o /home/ec2-user/express-service/logs/out.log -e /home/ec2-user/express-service/logs/err.log server.js
```
Check node processes running
```
forever list
```
## Stop API/App
scripts/stop_server (All commands has to be executed as root or using sudo)
```
#!/bin/bash
forever stopall
```
To stop one process, you can list then using pid you can stop it
```
forever list
forever stop {Prcoess_Id}

example:

$ sudo forever list
info:    Forever processes running
data:        uid  command       script    forever pid   id logfile                 uptime       
data:    [0] 1f2h /usr/bin/node server.js 16310   16320    /root/.forever/1f2h.log 0:2:4:52.312 
$

sudo forever stop 16320
info:    Forever stopped process:
    uid  command       script    forever pid   id logfile                 uptime       
[0] 1f2h /usr/bin/node server.js 16310   16320    /root/.forever/1f2h.log 0:2:8:20.135 
$
```

## How to test
```
curl http://{host_name}:80/customers?name=jack

Example:

add curl example here

```

## OpenAPI Specs
Swagger/OpenAPI Specs can be found at [Customer Profile API OpenAPI Specs](https://app.swaggerhub.com/apis/Earth2Software/customer-profile-api/1.0.0)

