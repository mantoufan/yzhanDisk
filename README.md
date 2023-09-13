# Multi User Cloud Disk
A serveless rapid development practice all rely on AWS and Flowbite   
Start Date: 2023-09-06 19:00 End At: 2023-09-08 21:00  
![Start Date proof](https://s2.loli.net/2023/09/08/92b1Cc4XiFeE8pM.png)

## Demo
[Online Demo](https://aws.os120.com) && [Video On my Site](https://yu.mantoufan.com/202309082315336172)
```shell
yarn install && yarn start
```
## Back-end Code
1. [Lambda](./lambda)  
- [Lambda for responding to a DynamoDB trigger and controlling an EC2 instance](./lambda/maws_run_ec2)  
2. [Shell scripts runs on EC2 Instance](./ec2.sh)  

## Feature List
1. Building a user center using Cognitio  
2. Upload txt file to S3 directly via API Gateway  
3. Synchronize real-time Log base on Sokcet.IO, which is powered by goeasy.io
4. Rmoete create and send commands to EC2, using it for proccessing S3 Objects
5. CRUD all data to DynamoDB
6. All AWS products I used in this repo
![Aws Product](https://s2.loli.net/2023/09/08/MrCTeptzv8YKEuR.png)

## Best Practice
1. Every Coginto route has a lambda
![Snipaste_2023-09-08_20-23-16.png](https://s2.loli.net/2023/09/08/nw2eE8NRZtKbyjl.png)
2. Using API Gateway integrated S3, no need for file transfer
3. Using Systems Manager to send command to ECS , no user_data or SSH  
4. Using IAM Identity Center for AWS-CLI SSO.  
[My AWS access portal URL](https://d-97675772b6.awsapps.com/start)  
Development users does not have permission to manage users
5. Each application has a role and is granted the minimum permissions
6. Scan dynamoDB is wasteful, so I use websocket to receive message from server, scan only when updated  
I know abusing websocket is not a good idea ^_^