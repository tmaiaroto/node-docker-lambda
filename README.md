# node-docker-lambda

Ever want to run your AWS Lambda functions somewhere other than AWS Lambda? Did you create some awesome Lambda only to find out it takes
longer than 5 minutes to run? Not a problem! You can easily run your AWS Lambda function anywhere you can run Docker.

This is designed as a command line tool to help you wrap your existing (Node.js) AWS Lambda functions within a Docker container to run. 
You can also simply look at the `Dockerfile` and `_container.js` file here for examples in building your own Docker container.

It's useful if you want to sometimes run code in AWS Lambda while other times in a Docker container on your own servers or perhaps through ECS. 

It assumes your AWS Lambda function exists within an `index.js` file as `exports.handler()` (for now). If you need to change this or change 
some of the options for the Docker container, you can use the copy command instead of the build command. This will give you the opportunity
to change everything. If your needs are basic, you may be able to simply run the build command.

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

## Running & Deploying

To run the container:

`docker run container-name '{"event": "message"}'`

You can deploy your Lambda Docker container to anywhere you'd normally deploy your Docker containers. Perhaps it's ECS. Especially
if you are using other Amazon services. Note: Unlike AWS Lambda, you will not have an AWS session - so you will need to pass some
credentials. Setting environment variables is a good way to do this. Edit the `Dockerfile` (you'll need to use the copy command
and manually build the container) or use Amazon ECS to do it as an override in the Task.

Note: Amazon ECS lets you run Tasks directly from their web console. However, passing a JSON string to their form for the CMD
override presented some challenges. When that data was passed along and eventually got handed to `_container.js` as an argument,
it could not be parsed. At least for now, you can pass a base64 encoded JSON string which won't have any problems with escaping.

Don't forget, `_container.js` logs the results out to console (for context `done()`, `fail()` and `succeed()`) so use `docker logs`
to see the output from your docker containers if you aren't running them from the command line yourself.