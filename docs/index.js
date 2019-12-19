// jshint esversion: 6
var jsDoc = require("swagger-jsdoc");

var definition = {
	openapi: "3.0.0",
	info: {
		title: "Delivery Request API",
		version: "1.0.0",
		description: "Documentation for all delivery request api"
	}
};

var options = {
	definition,
	apis: [__dirname + "\\**.yml"]
};

module.exports = jsDoc(options);
