const { v4 } = require("uuid");
const AWS = require("aws-sdk");

exports.createBook = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  // Input validation
  try {
    const { Title, Author, PublishedYear, Genre } = JSON.parse(event.body);

    // Validate required fields
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

    const BookID = v4(); // Generar un ID único para el libro

    const newBook = {
      BookID,
      Title,
      Author,
      PublishedYear: Number(PublishedYear),
      Genre,
    };

    // Guardar el libro en DynamoDB
    await dynamodb
      .put({
        TableName: "BookTable",
        Item: newBook,
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(newBook),
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating book",
        error: error.message,
      }),
    };
  }
};
