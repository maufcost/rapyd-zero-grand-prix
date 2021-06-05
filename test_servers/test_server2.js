/*
 * THIS IS JUST ONE OF THE TEST SERVERS I USED TO TEST MY RAPYD APIs, NODE, AND REACT
 * ROUTES. EVERYTHING IS A MESS IN TERMS OF IDENTATION, STYLE, AND CONVENTIONS.
 * THIS DOES NOT REFLECT MY ACTUAL CODING STYLE. THE REAL SERVER IS ON THE ROOT
 * DIRECTORY, AND IT IS NAMED server.js
*/
require('dotenv').config()
const PORT = 5000;
var express = require('express');
var app = express();
var axios = require('axios');
var CryptoJS = require("crypto-js");
var http_method = 'post';                // Lower case.
var base_url = 'https://sandboxapi.rapyd.net';
var url_path = '/v1/checkout';    // Portion after the base URL.
var url = base_url + url_path;
var salt = CryptoJS.lib.WordArray.random(12);  // Randomly generated for each request.
var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
 // Current Unix time.
var access_key = process.env.RAPYD_ACCESS_KEY;     // The access key received from Rapyd.
var secret_key = process.env.RAPYD_SECRET_KEY;   // Never transmit the secret key by itself.

var body = {
	// 'amount': 99.99, // Remove 'amount' property if you provide a 'cart_items' prop.
	'country': 'US',
	'currency': 'USD',
	'complete_checkout_url': 'https://google.com',
	'cart_items': [
		{
			'name': 'that naaaaame',
			'amount': 19.12,
			'image': '',
			'quantity': 1
		}
	]
}
// JSON body goes here.
console.log(http_method)
console.log(url_path)
console.log(salt)
console.log(timestamp)
console.log(access_key)
console.log(secret_key)
console.log(JSON.stringify(body))
var to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + JSON.stringify(body);

var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));

signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

const instance = axios.create({
  headers: {
	  'access_key': access_key,
	  'content-Type': 'application/json',
	  'salt': salt,
	  'signature': signature,
	  'timestamp': timestamp
  }
});

app.use(express.json());
app.get('/rapyd-test', (req, res) => {
	// REQUEST MADE BY THE CLIENT
	console.log(req)
	console.log(req.body);

	if (JSON.stringify(body) !== '{}' && body !== '') {
		// console.log(body)
		// console.log(JSON.parse(body))
		// console.log(JSON.stringify(JSON.parse(body)))
	    body = JSON.stringify(body);
	}

	// MAKING A POST REQUEST TO THE CHECKOUT ROUTE SO THAT WE CAN GET THE URL
	// FOR THE CHECKOUT PAGE.
	instance.post(url, body)
	  .then(function (response) {
	    // handle success

	    console.log(response);
		console.log(response.data);
		console.log(response.data.redirect_url);
	  })
	  .catch(function (error) {
	    // handle error
	    console.log(error);
	  })
	  .then(function () {
	    // always executed
	  });

	return { hehe: 'I am a response' };
})

app.listen(PORT, () => {
	console.log(`The server is listening on port ${PORT}`)
})
