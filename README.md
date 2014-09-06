# MD Chat Workshop - An HTML5 chat based on Angular.js, firebase.io

md-chat is based on a simple Grunt.js stack that includes:

* Image resource compression (jpg, png, gif)
* SVG compression
* JS linting with JSHint
* Javascript & CSS minification
* Connect webserver with livereload
* Unit testing with Jasmine and PhantomJS
* SASS with libsass / node-sass
* Bower dependency management using wiredep
* Grunt task runners for development and distribution

## Pre-requisites

In general all you need to be prepared for this project and the workshop are 3 things:

- Node.js
- GIT
- Text editor of your choice

You can Install these three software components on any operating system without bigger issues. We recommend however, to 
use the pre-installed VM that is provided for the /ch/open workshop.

## Using a VM prepared for the workshop at /ch/open 

In the context of the /ch/open workshop we have prepared a VM (VMWare player image) for you that you can use for the 
workshop. All tools that you need are already pre-installed and you don't need to follow any further steps down in the 

1. First you need to download [VMWare Player](https://my.vmware.com/web/vmware/free#desktop_end_user_computing/vmware_player/6_0):
2. Download [the VM Zip file](http://images.workshoptage.ch/images/ws5/ws-5.zip) from the /ch/open server and extract into a folder on your machine (The VM is totally around 7 GB)
3. Import the VM into VMWare Player by opening the .vmx file
4. Start the VM to make sure everything is okay

Now you're set and prepared for the workshop. If you've installed the VM there are no more steps to follow.


### Node.js

On Linux (Ubuntu, Fedora, OS X etc.) I recommend you to use NVM (node version manager) to install node. This allows you
to later on switch the node version individually if you need to.

With `curl`

    curl https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh

With `wget`

    wget -qO- https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh

After installing NVM you need to start a new terminal or `source ~/.nvm/nvm.sh`

Now, you can install any version of Node by using nvm:

    nvm install 0.10

Or switch to an already installed version so it will be set as your system wide version:

    nvm use 0.9

For more options visit https://github.com/creationix/nvm

## Installation of the MD Chat

First you need to install bower and grunt global:

    sudo npm install -g bower grunt-cli

Then you can use the setup script:

    curl -L http://goo.gl/KOd2DZ | sh

Or you can clone the repository and install the MD Chat manually the following steps:

    git clone https://github.com/gionkunz/md-chat-workshop.git
    cd md-chat
    sudo npm install -g bower grunt-cli
    npm install
    bower install

## Usage

You can use the stack in two modes. You can run it as a server for development with livereload or you can use the stack
to build a package ready for distribution.

> If you're running with a Linux environment you might want to change the max file handles a user can allocate. The
underlying front-end stack is using grunt-watch which is heavily relying on open file handles.
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

### Distribution build

If you want to produce a distribution ready release of your code there will be a few tasks that should run before. This
includes unit testing, minification, JS linting, concatination etc. To build a distribution package you can run the
default task by just running grunt:

    grunt

### Server mode

Run the following command to run the stack in server mode:

    grunt serve

This will run a webserver on your local machine on port 9000 and automatically start your browser to the index of the
web project you're creating. It also has livereload that will trigger the browser to reload once you've saved changes
to your project.

> If you'd like to use a different port or use a different binding hostname than the broadcast address 0.0.0.0 you can
  configure it in the Package.json config section. On Windows there are issues when using the broadcast address and it's
  recommended that you change the hostname to localhost.

#### Server running from your distribution build

Sometimes you'd like to see the end result of your development served by a web browser before you publish your
distribution. For those situations you can use a grunt task target that will trigger a build and then start Connect
on the `dist` folder instead of your development state. This helps you to detect issues that may relate to compressed
resources or reeving.

    grunt serve:dist

### Test only

If you'd like to run only the unit test you can start grunt with the task `test`:

    grunt test

