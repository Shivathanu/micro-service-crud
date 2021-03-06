const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();
const DELIVERY_TABLE = process.env.TABLE || "DeliveryRequest";
const IS_OFFLINE = process.env.NODE_ENV !== "production";
const uuid = require("uuid");
const dynamoDb =
	IS_OFFLINE === true
		? new AWS.DynamoDB.DocumentClient({
				apiVersion: "2019-12-10",
				region: "us-west-2",
				endpoint: "https://dynamodb.us-west-2.amazonaws.com"
		  })
		: new AWS.DynamoDB.DocumentClient();
var lodash = require("lodash");

/**
 * Controller method to register the users
 *
 * @param {Object} request
 * @param {Object} response
 */
router.get("/deliveryrequests/:id", (request, response) => {
	const DeliveryRequestId = request.params.id;
	const params = {
		TableName: DELIVERY_TABLE,
		Key: {
			DeliveryRequestId
		}
	};
	dynamoDb.get(params, (error, result) => {
		if (error) {
			console.log("error: ", error);
			response.status(400).json({
				message: `Error retrieving Delivery Request data for ${DeliveryRequestId}`,
				error: error
			});
		}
		if (!lodash.isEmpty(result)) {
			response.json(result.Item);
		} else {
			response.json({
				error: `Delivery Request with id: ${DeliveryRequestId} not found`
			});
		}
	});
});

/**
 * Controller method to fetch all the delivery request
 *
 * @param {Object} request
 * @param {Object} response
 */
router.get("/deliveryrequests", (request, response) => {
	const params = {
		TableName: DELIVERY_TABLE
	};
	dynamoDb.scan(params, (error, result) => {
		if (error) {
			console.log("error: ", error);
			response.status(400).json({
				message: "Error fetching the Delivery Request",
				error: error
			});
		}
		response.json(result.Items);
	});
});

/**
 * Controller method to create the delivery request
 *
 * @param {Object} request
 * @param {Object} response
 */
router.post("/deliveryrequests", (request, response) => {
	const {
		OrderId,
		ServiceId,
		DeliveryDate,
		Status,
		StatusDate,
		...rest
	} = request.body;
	const DeliveryRequestId = uuid();
	const params = {
		TableName: DELIVERY_TABLE,
		Item: {
			OrderId: OrderId,
			ServiceId: ServiceId,
			Status: "New",
			StatusDate: new Date()
				.toISOString()
				.replace("T", " ")
				.replace("Z", ""),
			DeliveryDate: DeliveryDate || "1900-01-01",
			DeliveryRequestId: DeliveryRequestId,
			...rest
		}
	};
	if (lodash.isEmpty(request.body)) {
		response.status(400).json({
			error: "No input provided"
		});
	} else {
		dynamoDb.put(params, (error, result) => {
			if (error) {
				console.log("error: ", error);
				response.status(400).json({
					message: "Could not create Delivery Request",
					error: error
				});
			}
			response.json({
				DeliveryRequestId
			});
		});
	}
});

/**
 * Controller method to update the delivery request
 *
 * @param {Object} request
 * @param {Object} response
 */
router.patch("/deliveryrequests/:id", (request, response) => {
	const DeliveryRequestId = request.params.id;
	var updateExpression = {};
	var expressionAttribute = {};
	var updateName = [];
	lodash.map(request.body, function(data, key) {
		updateExpression[`:${key}`] = data ? data : "None";
		expressionAttribute[`#${key}`] = key;
		updateName.push(`#${key} = :${key}`);
	});
	const params = {
		TableName: DELIVERY_TABLE,
		Key: {
			DeliveryRequestId
		},
		UpdateExpression: "set " + updateName.join(","),
		ExpressionAttributeNames: expressionAttribute,
		ExpressionAttributeValues: updateExpression,
		ReturnValues: "ALL_NEW"
	};
	if (lodash.isEmpty(request.body)) {
		response.status(400).json({
			error: "No input provided"
		});
	} else {
		dynamoDb.update(params, (error, result) => {
			if (error) {
				console.log("error: ", error);
				response.status(400).json({
					message: "Could not update Delivery Request",
					error: error
				});
			}
			response.json({ success: true });
		});
	}
});

/**
 * Controller method to delete the delivery request
 *
 * @param {Object} request
 * @param {Object} response
 */
router.delete("/deliveryrequests/:id", (request, response) => {
	const DeliveryRequestId = request.params.id;
	const params = {
		TableName: DELIVERY_TABLE,
		Key: {
			DeliveryRequestId
		}
	};
	dynamoDb.delete(params, error => {
		if (error) {
			console.log("error: ", error);
			response.status(400).json({
				message: "Could not delete Delivery Request",
				error: error
			});
		}
		response.json({ success: true });
	});
});

module.exports = router;
