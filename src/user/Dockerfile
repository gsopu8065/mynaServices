FROM node:7.4.0

# Prepare app directory
RUN mkdir -p /usr/src/app/user
ADD . /usr/src/app/user

# Install dependencies
WORKDIR /usr/src/app/user
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Expose the app port
EXPOSE 8081

# Start the app
CMD node index.js


#docker build -t 852365381440.dkr.ecr.us-east-2.amazonaws.com/myna-user:latest .
#aws ecr get-login --region us-east-2 --profile personal --no-include-email
#docker push 852365381440.dkr.ecr.us-east-2.amazonaws.com/myna-user:latest

#raj
#docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/user:latest .
#aws ecr get-login --region eu-west-1 --profile raj --no-include-email
#docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/user:latest