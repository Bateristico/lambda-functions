var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});
// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
    
    console.log(JSON.stringify(event.body));
  
    var params = {
      DelaySeconds: 10,
      MessageAttributes: {},
      MessageBody: JSON.stringify(event.body),
      QueueUrl: "https://sqs.us-east-2.amazonaws.com/089749834193/sqs-user"
    };    
    
    sqs.sendMessage(params, function(err, data) {
      console.log('inside function', params)
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
    
    // Return
    const response = {
        statusCode: 200,
        body: JSON.stringify('User processed'),
    };
    return response;
};

