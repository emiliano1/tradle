"use strict";

const dynamodb = require("./dynamodb");
const request = require("request");

function insert(event, subscriber) {
    let params = {
        Item: {
	        "event": event,
	        "subscriber": subscriber,
	        "created_at": new Date().toISOString()
	    },
        TableName: process.env.EVENT_TABLE_NAME
    };
    dynamodb.insert(params);
}

function remove(event, subscriber) {
	let params = {
        Key: {
	        "event": event,
	        "subscriber": subscriber
	    },
        TableName: process.env.EVENT_TABLE_NAME
    };
    dynamodb.remove(params);
}

function scan() {
	let params = {
        ProjectionExpression: "event, subscriber, created_at",
        TableName: process.env.EVENT_TABLE_NAME
    };
    return dynamodb.scan(params);
}

function deliver(event, endpoint) {
    request({
        url: endpoint,
        method: "POST",
        json: event
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("success");
            return true;
        }
        else {
            console.log("error: " + error);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
            return false;
        }
    });
}
