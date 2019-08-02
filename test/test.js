// jshint esversion: 8
// jshint node: true
//"use strict";

var assert = require("assert");
var request = require('request');
var http = require("http");

var should = require("should");
var expect = require("expect");
var util = require("util");

var chai = require('chai');
should = chai.should;
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

/**
  * @desc quick function to turn around the coordinates
  * @param array
  */
function turnLatLon(array) {
  var latlon = [];
  //go through points and change to latlon order
  for (var j = 0; j < array.length; j++) {
    var point = [];
    var lat = array[j][1];
    point.push(lat);
    var lon = array[j][0];
    point.push(lon);
    latlon.push(point);
  }
  return latlon;
}

//const owmtoken = require('./apitoken.js');
//let OWMTOKEN = owmtoken.OWM();
let OWMTOKEN = 'a988bea713a230eb33341d294930daa4';

// Test suite for the Coin class
describe( "summer_project - tests" , function() {

	it("test OWM API", function(done) {

		try{

			let createReq = http.request({
			  host: "samples.openweathermap.org",
			  //port: 3000,
				path: "/data/2.5/weather?q=London,uk&callback=test&appid=" + OWMTOKEN,
			  method: "GET",
			}, (createResponse) => {

				let createBody = "";

			  createResponse.on("data", (chunk) => {
			    createBody += chunk;
			  });

		  	createResponse.on("end", () => {
					assert.ok(createBody!==undefined);

					done();
				});
			});

			createReq.end();

		} catch(error){
			console.dir(error);
			assert.ok(false);
			done();
		}

	});

	it('testing turnLatLon() case 1', function(){
	      var turned = turnLatLon([[1 , 2],[3 , 4],[5 , 6]]);
	      assert.deepEqual(turned, [[2 , 1],[4 , 3],[6 , 5]]);
	});

	it('testing turnLatLon() case 2', function(){
				var turned = turnLatLon([[51.5656 , 7.3434],[-2.111 , 2.111]]);
				assert.deepEqual(turned, [[7.3434 , 51.5656],[2.111 , -2.111]]);
	});
});
