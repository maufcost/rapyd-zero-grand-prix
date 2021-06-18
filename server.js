// General config
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const CryptoAccount = require("send-crypto");
var axios = require('axios');
var CryptoJS = require("crypto-js");

const PORT = process.env.PORT || 5000;
const app = express();

// Rapyd request setup
const httpMethod = 'post'; // Should always be lower case (not POST)
const baseURL = 'https://sandboxapi.rapyd.net';
const urlPath = '/v1/checkout';
const fullRapydURL = baseURL + urlPath;
const salt = CryptoJS.lib.WordArray.random(12);
const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
const accessKey = "235FCE21EB935EEE0FA0";
const secretKey = "d840d232c1e029f9b186266c34d04b82cbc34765e446d330e8c507fca107872b95ed1fba1fc33fca";

var body = {
	// 'amount': 99.99, // Remove 'amount' property if you provide a 'cart_items' prop.
	'country': 'US',
	'currency': 'USD',
	'complete_checkout_url': 'http://localhost:3000/success',
	'cart_items': [
		{
			'name': 'that naaaaame',
			'amount': 19.12,
			'image': '',
			'quantity': 1
		}
	]
}

// Setting up Rapyd signature before making requests.
const signatureKey = httpMethod + urlPath + salt + timestamp + accessKey + secretKey + JSON.stringify(body);
let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(signatureKey, secretKey));
signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

// Creating a special Axios instance to add custom request headers.
const instance = axios.create({
	headers: {
		'access_key': accessKey,
		'content-Type': 'application/json',
		'salt': salt,
		'signature': signature,
		'timestamp': timestamp
	}
});

// Uncomment to test if your env vars are set up correctly:
// console.log(urlPath)
// console.log(accessKey)
// console.log(secretKey)

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/payment', async (req, res) => {
	// Props: paymentCurrency, amount, pk (private key)
	console.log(req.body);

	const paymentCurrency = req.body.paymentCurrency;
	const amount = req.body.amount;
	const pk = req.body.pk;

	// Processing cryptocurrency payments
	if (paymentCurrency === 'BTC' || paymentCurrency === 'ETH') {
		// Loading account from private key
		const account = new CryptoAccount(pk);

		// Transferring funds
		try {
			await account
			    .send(process.env.SELLING_CRYPTO_ACCOUNT, amount, paymentCurrency)
				// Just to make sure everything went alright...
			    .on('transactionHash', console.log)
			    .on('confirmation', console.log);

			res.send({ success: true });
		} catch(error) {
			// An error occurred, such as:
			// Insufficient funds from wallet
			// Invalid private key
			// (...)
			res.send({ success: false });
		}
	}else {
		// Payment using native currency (e.g. USD, EUR, BRL, etc)
		const url = await processRapydPayment(req.body);
		console.log(url)
		res.send({ url });
	}
});

const processRapydPayment = (xxx) => {
	// *** Sample body WITH a shopping cart:
	// {
	// 	'country': 'US',
	// 	'currency': 'USD',
	// 	'complete_checkout_url': 'https://google.com',
	// 	'cart_items': [
	// 		{
	// 			'name': 'that naaaaame',
	// 			'amount': 19.12,
	// 			'image': 'STATIC_FILE_ADDRESS',
	// 			'quantity': 1
	// 		}
	// 	]
	// }

	// *** Sample body WITHOUT a shopping cart:
	// {
	// 	'amount': 99.99, // Remove 'amount' property if you provide a 'cart_items' prop.
	// 	'country': 'US',
	// 	'currency': 'USD',
	// 	'complete_checkout_url': 'https://google.com'
	// }

	// Stringifying our request body
	if (JSON.stringify(body) !== '{}' && body !== '') {
	    reqBody = JSON.stringify(body);
	}

	instance.post(fullRapydURL, body)
	.then(res => {
		return res.data.data.redirect_url;
	})
	.catch(error => {
		console.log('An error occurred!');
		console.log(error);
	})
	.then(() => {
		// Equivalent to finally{} (It's always executed).
	})
}

// Routes
app.get('/disburse', async (req, res) => {
	// Props: bankAccount, transferAmount, walletSender (valid rapyd wallet)
	console.log(req.body);
	
	// Comment the following and uncomment the other one
	var bankAccount = "BG96611020345678";
	var transferAmount = "2";
	var walletSender = "ewallet_dfc659569155e576aad8d8cc334ed22e";
	
	// Uncomment to use data from the request
	
	//var transferAmount = req.body .transferAmount;
	//var bankAccount = req.body.bankAccount;
	//var walletSender = req.body.walletSender;
	
	// Data of the person receiving the money from the store wallet
	var receiver = {
					"name":"Nathan Wilk",
					"address": "123 Nathan Mauricio Street",
					"email": "Nathan@Mauricio.winners",
					"country": "US",
					"city": "Orlando",
					"postcode": "33333",
					"account_number": bankAccount , // Bank account number from the input
					"bank_name": "US General Bank", // Bank Name, should I just leave the default ones?
					"state": "FL",
					"identification_type": "SSC", // Bank data stuff. I would rather not touch these lmao
					"identification_value": "123456789",
					"bic_swift": "BUINBGSF",
					"ach_code": "123456789"
	};
	
	// Data Object of the person sending the money
	var sender = {
					"name":"Nathan Wilk 2",
					"address": "123 Nathan Mauricio Street",
					"city": "Orlando",
					"state": "FL",
					"date_of_birth": "29/07/2001", // NOTE! DD/MM/YYYY (Took some debugging to fix this lol)
					"postcode": "33333",
					"phonenumber": "9999999999",
					"remitter_account_type": "Individual",
					"source_of_income": "salary",
					"identification_type": "License No", // I feel like we should just use the demo stuff here
					"identification_value": "123456789",
					"purpose_code": "ABCDEFGHI",
					"account_number": "123456789",
					"beneficiary_relationship": "client" // The "store" is sending money to the owner
	}
	
	// Body request
	var data = JSON.stringify({
								"beneficiary": receiver,
								"beneficiary_country": "US",
								"beneficiary_entity_type": "individual",
								"description": "Payout - Transfer from Store to Bank Account",
								"merchant_reference_id": "GHY-0YU-HUJ-POI",
								"ewallet": walletSender, // MUST BE A VALID Rapyd Wallet
								"payout_amount": transferAmount, // Amount to Transfer as a string!
								"payout_currency": "USD",
								"payout_method_type": "us_general_bank",
								"sender": sender,
								"sender_country": "US",
								"sender_currency": "USD",
								"sender_entity_type": "individual",
								"statement_descriptor": "GHY* Limited Access 800-123-4567",
								"metadata": {
									"merchant_defined": true
								 }
	});
	
	let url = baseURL + '/v1/payouts';
	let the_salt = CryptoJS.lib.WordArray.random(12);
	let the_time = (Math.floor(new Date().getTime() / 1000) - 10).toString();
	
	let signed = httpMethod + url + the_salt + the_time + accessKey + secretKey + JSON.stringify(data);
	let le_sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(signed, secretKey));
	le_sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(le_sign));
	
	
	var config = {
	  method: 'post',
	  url: 'https://sandboxapi.rapyd.net/v1/payouts',
	  headers: { 
		'Content-Type': 'application/json', 
		'access_key': accessKey, 
		'salt': the_salt, 
		'timestamp': the_time, 
		'signature': le_sign
	  },
	  data : data
	};
	
	axios(config)
	.then(function (response) {
	  console.log(JSON.stringify(response.data));
	})
	.catch(function (error) {
	  console.log(error);
	});
	
});


app.listen(PORT, () => {
	console.log(`The server is listening on port ${PORT}`);
});
