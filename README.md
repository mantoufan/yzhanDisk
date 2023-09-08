# Project for Coding Challenge
After nearly 2 days coding, I feel pride to share the project to you.  
Thank you for so nice chanllenge, I gain a lot.
## Demo
[Online Demo](http://)   &&  [Video]()
```shell
yarn install && yarn start
```

## Feature List
1. All Basic requirements, except that:  
- Authoration of all API Gateway, including S3
2. All Bonus requirements, except that:  
- Deployed on github page, not Amplify
3. Others
- A Log based on socket
4. All AWS products I used
![Aws Product](https://s2.loli.net/2023/09/08/MrCTeptzv8YKEuR.png)
## Best Practice
1. Every Coginto route has a lambda.
![Snipaste_2023-09-08_20-23-16.png](https://s2.loli.net/2023/09/08/nw2eE8NRZtKbyjl.png)
2. Using API Gateway integrated S3, no need for file transfer
3. Using Systems Manager to send command to ECS , no user_data or SSH  
4. Using IAM Identity Center for AWS-CLI SSO.  
[My AWS access portal URL](https://d-97675772b6.awsapps.com/start)  
Development users does not have permission to manage users
5. Each application has a role and is granted the minimum permissions
6. Scan dynamoDB is wasteful, so I use websocket to receive message from server, scan only when updated  
I know abusing websocket is not a good idea ^_^

