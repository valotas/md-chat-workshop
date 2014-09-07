#!/bin/bash

if [ `git branch | sed -n '/\* /s///p'` != "my-branch" ]; then
  git checkout -b my-branch
fi

git add .
git commit -m "My changes for step-$1"
git rebase step-$1
