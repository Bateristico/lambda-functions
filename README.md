# lambda-functions

1. `serverless-api`
resolve a get and post request and save it to the database 

POST payload example
```
{
    "userId": "1",
    "name": "Mirka",
    "age": 12
}
```

2. `sqs-users-poller`
reads the user queue, parse the message and saves it to the dynamodb

3. `sqs-message`
uses the aws-sdk to post the message in the user queue