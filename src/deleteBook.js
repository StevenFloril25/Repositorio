const AWS = require("aws-sdk");

exports.deleteBook = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { BookID } = event.pathParameters;

  await dynamodb
    .delete({
      TableName: "BookTable",
      Key: { BookID },
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({
      message: "Libro eliminado correctamente",
    }),
  };
};
