const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'User';
const userPath = '/user';


exports.handler = async function(event){
    console.log('Request event: ', event);
    let response;

    switch(true){
        case event.httpMethod === 'GET' && event.path === userPath:
            response = await getUsers();
            break;
        case event.httpMethod === 'POST' && event.path === userPath:
            response = await saveUser(JSON.parse(event.body));
            break; 
        default:
            response = buildResponse(404, '404 Not Found') ;
            break; 
    }

    return response;

}

async function getUsers(){
    const params = {
        TableName: dynamodbTableName
    };
    const allUsers = await scanDynamoRecords(params, []);
    const body = {
        users: allUsers
    }
    return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray){
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey){
            scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error){
        console.error(error)
    }
}

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
        body: JSON.stringify(body)
    }
}