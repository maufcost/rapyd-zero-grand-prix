/*
 * THIS IS JUST ONE OF THE TEST SERVERS I USED TO TEST MY RAPYD APIs, NODE, AND REACT
 * ROUTES. EVERYTHING IS A MESS IN TERMS OF IDENTATION, STYLE, AND CONVENTIONS.
 * THIS DOES NOT REFLECT MY ACTUAL CODING STYLE. THE REAL SERVER IS ON THE ROOT
 * DIRECTORY, AND IT IS NAMED server.js
*/
require('dotenv').config()
var axios = require('axios');
var CryptoJS = require("crypto-js");
var http_method = 'get';                // Lower case.
var base_url = 'https://sandboxapi.rapyd.net';
var url_path = '/v1/data/countries';    // Portion after the base URL.
var url = base_url + url_path;
var salt = CryptoJS.lib.WordArray.random(12);  // Randomly generated for each request.
var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
                                        // Current Unix time.
var access_key = process.env.RAPYD_ACCESS_KEY;     // The access key received from Rapyd.
var secret_key = process.env.RAPYD_SECRET_KEY;   // Never transmit the secret key by itself.
var body = '';                          // JSON body goes here.

// if (JSON.stringify(request.data) !== '{}' && request.data !== '') {
//     body = JSON.stringify(JSON.parse(request.data));
// }

var to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + body;

var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));

signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

const instance = axios.create({
  headers: {
	  'X-Custom-Header': 'foobar',
	  'access_key': access_key,
	  'content-Type': 'application/json',
	  'salt': salt,
	  'signature': signature,
	  'timestamp': timestamp
  }
});

instance.get(url)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
