"use strict";

const dynamodb = require("./dynamodb");

function scan() {
	let params = {
        ProjectionExpression: "endpoint",
        TableName: process.env.SUBS_TABLE_NAME
    };
    return dynamodb.scan(params);
}
