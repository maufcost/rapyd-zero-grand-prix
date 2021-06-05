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
const accessKey = process.env.RAPYD_ACCESS_KEY;
const secretKey = process.env.RAPYD_SECRET_KEY;

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

app.listen(PORT, () => {
	console.log(`The server is listening on port ${PORT}`);
});
