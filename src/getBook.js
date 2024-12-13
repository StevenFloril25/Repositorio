const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getBooks = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  try {
    const result = await dynamodb
      .scan({
        TableName: "BookTable", // Asegúrate de que coincida con el nombre de la tabla en el serverless.yml
      })
      .promise();

    const books = result.Items;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        books,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving books",
        error: error.message,
      }),
    };
  }
};

exports.getBookById = async (event) => {
  const bookId = event.pathParameters.bookId; 

  if (!bookId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "BookID is required" }),
    };
  }

  const params = {
    TableName: "BookTable",
    Key: {
      BookID: bookId,
    },
  };

  try {
    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ book: result.Item }),
    };
  } catch (error) {
    console.error("Error retrieving book:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error retrieving book", 
        error: error.message 
      }),
    };
  }
};