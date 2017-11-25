cd emotions
docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/emotions:latest .
docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/emotions:latest
cd ../news
docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/news:latest .
docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/news:latest
cd ../status
docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/status:latest .
docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/status:latest
cd ../user
docker build -t 396927441011.dkr.ecr.eu-west-1.amazonaws.com/user:latest .
docker push 396927441011.dkr.ecr.eu-west-1.amazonaws.com/user:latest