const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'User';


exports.handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const { messageId, body } of event.Records) {
        console.log('SQS message %s: %j', messageId, body);
        //console.log(JSON.parse(body))
        const response = await saveUser(JSON.parse(body));
    }
    return `Successfully processed ${event.Records.length} messages.`;
};

async function saveUser(requestBody){
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'save user',
            Message: 'success',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error(error)
    })
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body//JSON.stringify(body)
    }
}