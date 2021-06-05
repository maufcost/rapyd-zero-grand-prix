const express = require('express');
const app = express();
const cors = require('cors');
const CryptoAccount = require("send-crypto");
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.post('/payment', (req, res) => {
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
			    .send('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount, paymentCurrency)
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
	}
});

app.listen(PORT, () => {
	console.log(`The server is listening on port ${PORT}`);
});
