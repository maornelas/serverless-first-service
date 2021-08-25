'use strict';
const bcrypt = require('bcryptjs')
const AWS = require('aws-sdk')
const jwt = require('jsonwebtoken')

module.exports.login = async (event, context) => {
  const body = JSON.parse(event.body)

  const queryUserParams = {
    TableName: "user-service-userTable-dev",
    KeyConditionExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'pk'
    },
    ExpressionAttributeValues: {
      ':username': body.username
    }
  }

  console.log( " queryUserParams = ", queryUserParams)
  console.log (" process.env.JWT_SECRET = ", process.env.JWT_SECRET)

  let userResult = {}
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    userResult = await dynamodb.query(queryUserParams).promise()
  } catch (queryError) {
    console.log('There was an error attempting to retrieve the user')
    console.log('queryError', queryError)
    console.log('queryUserParams', queryUserParams)
    return new Error('There was an error retrieving the user')
  }

  if (typeof userResult.Items !== 'undefined' &&
    userResult.Items.length === 1) {
    const compareResult = bcrypt.compareSync(body.password, userResult.Items[0].password)
    if (compareResult) {
      let token = jwt.sign({
        username: userResult.Items[0].pk
      }, "M8E7rbJtRP")
      return {
        statusCode: 200,
        body: JSON.stringify({
          token: token
        })
      }
    }
  }
  return {
    statusCode: 404
  };
};