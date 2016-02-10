FROM mhart/alpine-node:base
# FROM mhart/alpine-node:base-0.10
# FROM mhart/alpine-node

WORKDIR /src
ADD . .

# See mhart/apline-node for more info on the following.
# Most likely you already have all of your dependencies in
# `node_modules` because AWS Lambda does not run npm install
# either and you likely were testing locally.
# 
# If you have native dependencies, you'll need extra tools
# RUN apk add --update make gcc g++ python

# If you need npm, don't use a base tag
# RUN npm install

# If you had native dependencies you can now remove build tools
# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ENTRYPOINT ["node", "_container.js"]
# {} is the default parameter passed, but it can be overwritten.
# docker run <container-name> param
# 
# For example: docker run lambda-container '{"my": "event message"}'
# 
# `container.js` will use JSON.parse(). If it fails, it will exit with an error.
# If there is no parameter passed, that's ok. It uses "{}" by default.
# 
# Note: base64 stringified JSON is supported here too.
# For example: docker run lambda-container 'eyJteSI6ICJldmVudCBtZXNzYWdlIn0='
CMD ["{}"]