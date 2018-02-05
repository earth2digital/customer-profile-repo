!#/bin/sh
mkdir /efs
mount -t nfs4 -o \"nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 fs-42fa0c7b.efs.ap-southeast-2.amazonaws.com: /efs
df -h
ls -ltr /efs
cp imagedefinitions.json /efs
ls -ltr /efs
