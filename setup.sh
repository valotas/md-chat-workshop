#!/bin/bash
if [ ! -d $HOME/md-chat-workshop/.git ]
then
  cd $HOME
  git clone https://github.com/gionkunz/md-chat-workshop.git
  cd $HOME/md-chat-workshop
  for remote in `git branch -r | grep -v master `; do git checkout --track $remote ; done
  git checkout master
else
  cd $HOME/md-chat-workshop
  git pull --all --rebase
fi
 
cd $HOME/md-chat-workshop
npm install
bower install

