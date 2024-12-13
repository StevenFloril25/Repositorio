const AWS = require("aws-sdk");

exports.updateBook = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { BookID } = event.pathParameters;

  try {
    const { Title, Author, PublishedYear, Genre } = JSON.parse(event.body);

    // Input validation
    if (!Title || !Author || !PublishedYear || !Genre) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Validate PublishedYear is a number
    if (isNaN(PublishedYear) || PublishedYear < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid PublishedYear" }),
      };
    }

    const updatedBook = await dynamodb
      .update({
        TableName: "BookTable",
        Key: { BookID },
        UpdateExpression:
          "SET Title = :Title, Author = :Author, PublishedYear = :PublishedYear, Genre = :Genre",
        ExpressionAttributeValues: {
          ":Title": Title,
          ":Author": Author,
          ":PublishedYear": Number(PublishedYear),
          ":Genre": Genre,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,PUT",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Book updated successfully",
        book: updatedBook.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating book:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error updating book", 
        error: error.message 
      }),
    };
  }
};