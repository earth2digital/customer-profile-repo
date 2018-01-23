## Overview
This is a nodeJS customer profile repo to demo E2E Architecture Design for customer profile API. This API returns the customer profile details from AWS DynamoDB database. 

## Generate and use multiple ssh keys for github

- Generate SSH keys for 2 github accounts
```
$ ssh-keygen -t rsa -C "fname.lastname@company1.com" -f ~/.ssh/{KeyFileNameForAccount1}
$ ssh-keygen -t rsa -C "fname.lastname@company2.com" -f ~/.ssh/{KeyFileNameForAccount2}
```
- Add the above keys to ssh client
```
$ ssh-add ~/.ssh/{KeyFileNameForAccount1}
$ ssh-add ~/.ssh/{KeyFileNameForAccount2}
```
- List your ssh keys
```
$ ssh-add -l
```
- Modify ssh config file
```
$ cd ~/.ssh/
$ touch config
$ vi config

#Account1
Host github.com-{GITHUB_USERNAME_FOR_ACCOUNT1}
	HostName github.com
	User git
	IdentityFile ~/.ssh/{KeyFileNameForAccount1}

#account2
Host github.com-{GITHUB_USERNAME_FOR_ACCOUNT2}
	HostName github.com
	User git
	IdentityFile ~/.ssh/{KeyFileNameForAccount2}
```
- Set URL for Git
```
$ git remote set-url origin git@github.com-{GITHUB_USERNAME_FOR_ACCOUNT1}:{Company1Name}/customer-profile-repo.git
```
- To get a copy of this repo
```
$ git clone git@github.com-{GITHUB_USERNAME_FOR_ACCOUNT1}:{Company1Name}/customer-profile-repo
```
- push updates
```
$ git add -A
$ git commit -am "commit message, please write clearly the updates you have done as part of the commit"
$ git push

Counting objects: 9, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (9/9), done.
Writing objects: 100% (9/9), 1.41 KiB | 1.41 MiB/s, done.
Total 9 (delta 6), reused 0 (delta 0)
remote: Resolving deltas: 100% (6/6), completed with 4 local objects.
To github.com-adamaliau:earth2software/customer-profile-repo.git
   ffba2fc..5605747  master -> master
$
```
## How to create a new feature branch?
- To get a baring of the updates I have made
```
$ git status
```
- Create a new branch. The below command will create a new branch from master as well checkout out that new branch at the same time
```
$ git checkout -b dev/uselessFeatureBranch
```
- do the changes/develop the new feature
- Stage the updates for commitment
```
$ git add -A
```
- Commit updates to the branch
```
$ git commit -m "commiting useless feature branch"
```
- Push the new feature branch 
```
$ git push --set-upstream origin dev/uselessFeatureBranch
```
## How to build local_modules
In some cases if you need to install local modules because you don't have them in the standard npm distribution (e.g. custom built AWS JS SDK using https://sdk.amazonaws.com/builder/js/ to minimize the size of your node_modules folder).

first you create local_modules and inside the folder you add your modules one by one. Each module would have to have package.json and optionally other files like README.md
inside package.json including local_modules would look like that
```
{
    "name": "customer-profile-api-app",
    "description": "This is the customer profile API app which queries customer details from AWS DynamoDB",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "aws-sdk": "^2.176.0",
        "body-parser": "^1.18.2",
        "express": "latest",
        "express-healthcheck": "^0.1.0",
        "my-module": "file:local_modules/my-module",
        "request": "^2.83.0"
    }
}
```
./local_modules/my-module/package.json
```
{
    "name": "my-module",
    "description": "This is a test for adding local_module to the app",
    "version": "0.1.0",
    "private": true
}
```
to run npm install in a way to have local_modules included as links in node_modules, you execute the command below:
```
npm install --save ./local_modules/my-module
```
then execute the below command to get the rest of the modules that are not local_modules
```
npm install
```
after all is done, you commit the files to github. node_modules won't be commited as it is listed in the .gitingnore file. local_modules would get committed.

## How to create nodeJS Unit Test Cases
1. Install JEST (Facebook)
```
$ cd app
$ npm install --save-dev jest-cli
$ cat package.json
```
2. Create Unit Test Cases file
```
$ vi server.test.js
```
3. add the below to server.test.js (It tests return object in case no records are found)
```
const search_transform = require('./server.js');
  
test('Transform Response from CloudSearch', () => {
  var cloudSearchResponseString = `{
    "status": {
        "rid": "/rnE+e4oCAqfEEs=",
        "time-ms": 6
    },
    "hits": {
        "found": 0,
        "hit": [
        ],
        "start": 0
    }
  }`;

  var cloudSearchResponseObject = JSON.parse(cloudSearchResponseString);

    var expectedReturnObject = [];
    let notFound = {};
    notFound['crn'] = 'No records found';
    notFound['name'] = 'No records found';
    notFound['dateOfBirth'] = 'No records found';
    notFound['singlelineaddress'] = 'No records found';
    expectedReturnObject.push(notFound);

    expect(search_transform(cloudSearchResponseObject)).toEqual(expectedReturnObject);
});
```
4. Modify package.json
```
"scripts": {
        "test":"jest"
},
```
5. Run Unit Test
```
$ npm run test

> customer-profile-api-app@0.1.0 test /Users/adam/Documents/Woolies X/customer-profile/customer-profile-repo/app
> jest

 PASS  ./server.test.js
  ✓ Transform Response from CloudSearch (3ms)

  console.log server.js:119
    server running at port: 8080

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.061s
Ran all test suites.
$
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
- If you will use Docker, Dockerfile is the file you use to build the docker image
```
$ docker build --tag="earth2/customer-profile-app:v1.0.0" {directory_where_your_files_are}
```
- Get docker image id
```
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
earth2/customer-profile-app   v1.0.0              df888ed3e290        About an hour ago   91.1MB
alpine                        3.7                 3fd9065eaf02        11 days ago         4.15MB
```
- To run docker image
```
$ docker run -d -t -i -e APIKey={APIKey} -e APISecret={APISecret} -e AWSCloudSearchDomainEndpoint='{AWSCloudSearchDomainEndpoint}' -p 80:8080 -it {DockerImageId}

a83a35aa19c97cca5a8bd925ccd529a6ee28af755b2f587847232ee57db9c575
$ 
```
- To check docker logs
```
$ docker logs a83a35aa19c97cca5a8bd925ccd529a6ee28af755b2f587847232ee57db9c575

> customer-profile-api-app@0.1.0 start /opt/app
> node server.js "server.js"

server running at port: 8080
$
```
- Test App/API
```
$ curl http://localhost:80/customers?name=adam
{
    "status": "OK",
    "predictions": [
        {
            "name": "test adam",
            "firstname": "adam",
            "lastname": "emmitt",
            "dateofbirth": "1967-05-01",
            "singlelineaddress": "702T 10 16 Marquet Street",
            "crn": "100000002"
        },
        {
            "name": "maza adam ali",
            "firstname": "jack",
            "lastname": "lester",
            "dateofbirth": "1977-05-01",
            "singlelineaddress": "701T 10 16 Marquet Street",
            "crn": "100000003"
        }
    ]
}$ 
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
npm install --save ./local_modules/my-module
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

