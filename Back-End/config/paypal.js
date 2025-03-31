const paypal = require('paypal-rest-sdk');

//ToDo:Have to Install Paypal SDK using npm install paypal-rest-sdk
paypal.configure({
    'mode': 'sandbox', // or 'live'
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;


