#!/bin/sh
echo "creating /efs mount point directory"
mkdir /efs
echo "Mounting EFS at /efs"
mount -t nfs4 -o \"nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 fs-42fa0c7b.efs.ap-southeast-2.amazonaws.com: /efs
echo "displaying mounted file systems"
df -h
echo "displaying content of /efs"
ls -ltr /efs
echo "Copying imagedefinitions.json to /efs"
cp imagedefinitions.json /efs
echo "Listing files under /efs"
ls -ltr /efs
