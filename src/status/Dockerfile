FROM node:7.4.0

# Prepare app directory
RUN mkdir -p /usr/src/app/status
ADD . /usr/src/app/status

# Install dependencies
WORKDIR /usr/src/app/status
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Expose the app port
EXPOSE 8081

# Start the app
CMD node index.js


#docker build -t 852365381440.dkr.ecr.us-east-2.amazonaws.com/myna-status:latest .
#aws ecr get-login --region us-east-2 --profile personal --no-include-email
#docker push 852365381440.dkr.ecr.us-east-2.amazonaws.com/myna-status:latest


#Raj
#docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/status:latest .
#aws ecr get-login --region eu-west-1 --profile raj --no-include-email
#docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/status:latest