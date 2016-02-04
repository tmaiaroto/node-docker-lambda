# node-docker-lambda

This is designed as a command line tool to help you wrap your existing AWS Lambda functions within a Docker container to run. You can also
simply look at the `Dockerfile` and `_container.js` file here for examples in building your own Docker container.

It's useful if you want to sometimes run code in AWS Lambda while other times in a Docker container on your own servers or perhaps through ECS. 

## Installation

`npm install -g node-docker-lambda`

## Usage

You'll want to run these commands from where your AWS Lambda code exists.

To just copy the boilerplate files over (`Dockerfile` and `_container.js`) to your current working directory, run:

`ndl copy`

This way you can alter the Dockerfile and even the little Lambda "emulator" as you see fit. Then manually build the Docker image.

If you want to build the Docker container right away, just run:

`ndl build <name>`

Where `<name>` is the repository name/tag of your container (it's the `-t` flag for Docker).