#!/bin/bash

if [ $# -eq 0 ]
then
    pushmessage=`date +%Y-%m-%d`
else
    pushmessage="$*"
fi

#pushmessage=`date +%Y-%m-%d`

echo ${pushmessage}

git add -A
git commit -m "${pushmessage}"
git push origin master

