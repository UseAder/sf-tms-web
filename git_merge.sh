#!/usr/bin/env bash

#自动将develop分支的内容合并到master主分支

git checkout develop
git pull
git push
git checkout master
git pull
git merge develop
git push
git checkout develop