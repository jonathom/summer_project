// jshint esversion: 8
// jshint node: true
"use strict";

var assert = require("assert");
var request = require('request');
var http = require("http");

// server.js
const owmtoken = require('./apitoken.js');
let OWMTOKEN = owmtoken.OWM();

// Test suite for the Coin class
describe( "HTTP-CRUD Test" , function() {


	it("test movebank API", function(done) {

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
		      //let data = JSON.parse(createBody);
					assert.ok(createBody==undefined);




					//assert.ok(undefined!==data._id);
					//assert.ok(undefined!==createBody);
					done();
				});
			});

			// Write data to request body

			createReq.setHeader('Content-Type', 'application/json');
			createReq.write(JSON.stringify({foo: "bar"}));
			createReq.end();

		} catch(error){
			console.dir(error);
			assert.ok(false);
			done();
		}

	});



	it("test create and read item", function(done) {

		try{

			let itemId;

			let createReq = http.request({
			  host: "localhost",
			  port: 3000,
				path: "/item",
			  method: "POST",
			}, (createResponse) => {

				let createBody = "";

			  createResponse.on("data", (chunk) => {
			    createBody += chunk;
			  });

			  createResponse.on("end", () => {
			      let data = JSON.parse(createBody);
						//console.dir(data);
						itemId = data._id;
						assert.ok(undefined!==data._id);

						let readReq = http.request({
						  host: "localhost",
						  port: 3000,
							path: "/item?_id=" + itemId,
						  method: "GET",
						}, (readResponse) => {

							let readBody = "";

						  readResponse.on("data", (chunk) => {
						    readBody += chunk;
						  });

						  readResponse.on("end", () => {
					      let data = JSON.parse(readBody);
								//console.dir(data);
								assert.ok(undefined!==data._id && data._id==itemId);
								done();
							});
						});

						// Write data to request body

						readReq.setHeader('Content-Type', 'application/json');
						readReq.end();
				});
			});
			// Write data to request body

			createReq.setHeader('Content-Type', 'application/json');
			createReq.write(JSON.stringify({foo: "bar"}));
			createReq.end();

		} catch(error){
			console.dir(error);
			assert.ok(false);
			done();
		}

	});




	it("test create and update item", function(done) {
		try{

			let itemId;

			let createReq = http.request({
			  host: "localhost",
			  port: 3000,
				path: "/item",
			  method: "POST",
			}, (createResponse) => {

				let createBody = "";

			  createResponse.on("data", (chunk) => {
			    createBody += chunk;
			  });

			  createResponse.on("end", () => {

		      let data = JSON.parse(createBody);
					//console.dir(data);
					itemId = data._id;
					assert.ok(undefined!==data._id);

					let req = http.request({
					  host: "localhost",
					  port: 3000,
						path: "/item",
					  method: "PUT",
					}, (res) => {

						let body = "";

					  res.on("data", (chunk) => {
					    body += chunk;
					  });

					  res.on("end", () => {
								try{
						      let data = JSON.parse(body);
									//console.dir(data);
									assert.ok(undefined!==data._id && data._id==itemId);
									done();
						    } catch(error){
									console.dir(error);
									assert.ok(false);
									done();
						    }
						});
					});

					// Write data to request body

					req.setHeader('Content-Type', 'application/json');
					req.write(JSON.stringify({_id: itemId, foo: "bar updated", foo2: "foo2 added"}));
					req.end();

			});
		});

		// Write data to request body

		createReq.setHeader('Content-Type', 'application/json');
		createReq.write(JSON.stringify({foo: "bar created"}));
		createReq.end();

	} catch(error){
		console.dir(error);
		assert.ok(false);
		done();
	}

	});



	it("test create and delete item", function(done) {

		try{

			let itemId;

			let createReq = http.request({
			  host: "localhost",
			  port: 3000,
				path: "/item",
			  method: "POST"
			}, (createResponse) => {

				let createBody = "";

			  createResponse.on("data", (chunk) => {
			    createBody += chunk;
			  });

			  createResponse.on("end", () => {

		      let data = JSON.parse(createBody);
					itemId = data._id;
					assert.ok(undefined!==data._id);

					let reqBody = JSON.stringify({_id: itemId});

					let req = http.request({
					  host: "localhost",
					  port: 3000,
						path: "/item?_id=" + itemId,
					  method: "DELETE"
					}, (res) => {

						let body = "";

					  res.on("data", (chunk) => {
					    body += chunk;
					  });

					  res.on("end", () => {
							//console.dir({_id: itemId});
				      let data = JSON.parse(body);
							//console.dir(data);
							assert.ok(undefined!==data._id && data._id==itemId);
							done();

						});
					});

					// Write data to request body
					req.end();

				});
			});


			// Write data to request body

			createReq.setHeader('Content-Type', 'application/json');
			createReq.write(JSON.stringify({foo: "bar"}));
			createReq.end();

		} catch(error){
			console.dir(error);
			assert.ok(false);
			done();
		}

	});



});
