const { GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { documentClient } = require("../lib/dynamo");
const { tableName } = require("../config/env");

async function getUserByEmail(email) {
  const command = new GetCommand({
    TableName: tableName,
    Key: { email }
  });

  const result = await documentClient.send(command);
  return result.Item || null;
}

async function createUser(user) {
  const command = new PutCommand({
    TableName: tableName,
    Item: user,
    ConditionExpression: "attribute_not_exists(email)"
  });

  await documentClient.send(command);
  return user;
}

async function listUsers() {
  const command = new ScanCommand({
    TableName: tableName,
    ProjectionExpression: "email, #name, #role, joinedAt, isActive",
    ExpressionAttributeNames: {
      "#name": "name",
      "#role": "role"
    }
  });

  const result = await documentClient.send(command);
  return result.Items || [];
}

module.exports = {
  getUserByEmail,
  createUser,
  listUsers
};
