##############################################################################
#
# Overview:
#   This is the Dockerfile for customer profile API App 
# license:
#    name: MIT
#    url: https://opensource.org/licenses/MIT
#
##############################################################################

# 1. Define from what image we want to build from. Here we will use alpine 3.7
# which is the latest at the time of drafting this file

FROM alpine:3.7

# 2. Create app directory to hold application code inside the image
#    This will be the working directory for your application

WORKDIR /opt/app
RUN mkdir /home/ubuntu/workspace

# 3. copy files from app directory on soucre to /opt/app directory of docker image
#    .env would be executed as a parameter to --env-file
#    while running docker image

COPY app/ /opt/app/

# 4. Install app dependencies
#    npm install would install all the dependencies in package.json

RUN apk upgrade --update
RUN apk add --update \
    bash \
    curl \
    sed \
    nodejs
RUN bash -c "$(curl -sL https://rpm.nodesource.com/setup_8.x | bash -)"
RUN npm install

# 5. Bind node.js app to port 8080 and IP 0.0.0.0
#    If PORT is set as environment vraiable it would be set as the port
#    to be used by the node.JS app
#    IP is the same and it has to be set to 0.0.0.0 so that it can listen on 
#    all IP addresses. If left empty, it would be set to localhost and if set
#    to local host, you won't be able to connect to the container app port as
#    the app is listening only on it's localhost IP address
#    The below environment varaiables can be set in .env file but it was included 
#    here for clarity

ENV PORT=8080
ENV IP=0.0.0.0

EXPOSE 8080

# 7. define the command to run the app
#    We don't need forever as the containers when deployed on ECS
#    ECS would monitor its status and restart as necessary

CMD npm start server.js
