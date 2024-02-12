FROM node:10.16.0-alpine

ARG npm_token
ENV env_npm_token=$npm_token
WORKDIR /usr/src/app

####
COPY ./ .
####

RUN echo "//registry.npmjs.org/:_authToken=$env_npm_token \nregistry=https://registry.npmjs.org"| tee ./.npmrc


#COPY ./package.json .

# Install Node.js dependencies
RUN npm config set unsafe-perm true
RUN npm i yarn -g
RUN yarn


#RUN npm install -g pm2@3.1.3

# Copy application files
#COPY ./build .
#COPY .env .
COPY ./newrelic.js .

RUN yarn build:prod
# Run the container under "node" user by default
USER node
CMD [ "node", "build/server.js" ]

#CMD [ "pm2", "start", "server.js", "-i", "0", "--no-daemon" ]




