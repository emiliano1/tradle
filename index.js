"use strict";

const events = require("./controllers/events");
const subscribers = require("./controllers/subscribers");
const _ = require('underscore');

exports.handler = function (event, context, callback) {
    if('source' in event && event['source'] == 'aws.events'){
        // Event is AWS scheduled event
        var events_to_deliver = events.scan();
        for(var event_to_deliver in events_to_deliver){
            var payload = event_to_deliver.event;
            var endpoint = event_to_deliver.subscriber;
            var response = events.deliver(payload, endpoint);
            if(response){
                events.delete(payload, endpoint);
            }else{
                var date_now = new Date();
                var created_at = new Date(event_to_deliver.created_at);
                var expire_at = new Date(event_to_deliver.created_at).setHours(created_at.getHours() + 24);
                if(date_now > expire_at){
                    events.delete(payload, endpoint);
                }
            }
        }
    }else{
        var event_body = event.body;
        console.log("Event: ", JSON.stringify(event_body, null, 2));
        var subs = subscribers.scan();
        for(var sub in subs){
            var endpoint = sub.endpoint;
            var response = events.deliver(event_body, endpoint);
            if(response){
                console.log("Event delivered to ", endpoint);
            }else{
                console.log("Event not delivered to ", endpoint);
                events.insert(event_body, endpoint);
            }
        }
    }
}
