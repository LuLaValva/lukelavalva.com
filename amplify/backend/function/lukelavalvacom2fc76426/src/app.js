/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/albums", function (req, res) {
  res.json({
    albums: [
      {
        name: "Graceland",
        artist: "Paul Simon",
      },
      {
        name: "Hawaii: Part II",
        artist: "Miracle Musical",
      },
      {
        name: "Bookends",
        artist: "Simon & Garfunkel",
      },
      {
        name: "In Between Dreams",
        artist: "Jack Johnson",
      },
      {
        name: "Comfort Eagle",
        artist: "Cake",
      },
      {
        name: "Lola vs. Powerman and the Money-Go-Round, Pt. 1",
        artist: "The Kinks",
      },
      {
        name: "Magical Mystery Tour",
        artist: "The Beatles",
      },
      {
        name: "Out of the Blue",
        artist: "Electric Light Orchestra",
      },
      {
        name: "Marvin's Marvelous Mechanical Museum",
        artist: "Tally Hall",
      },
    ],
  });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
