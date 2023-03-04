import axios from 'axios';
import { useState } from 'react';
const { Buffer } = require('buffer');

function MpesaButton({subtotalAmount}) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [contact, setContact] = useState('');

  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');

  const auth = Buffer.from("YOUR_CONSUMER_KEY" + ":" + "YOUR_CONSUMER_SECRET").toString("base64");

  const password = Buffer.from("YOUR_BUSINESS_SHORTCODE" + "YOUR_PASSKEY" + timestamp).toString("base64");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
   
    try {
        console.log('Sending request with data: ', {
            BusinessShortCode: 'YOUR_BUSINESS_SHORTCODE',
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: subtotalAmount,
            PartyA: contact,
            PartyB: 'YOUR_BUSINESS_SHORTCODE',
            PhoneNumber: contact,
            CallBackURL: 'YOUR_CALLBACK_URL',
            AccountReference: 'YOUR_ACCOUNT_REFERENCE',
            TransactionDesc: 'YOUR_TRANSACTION_DESCRIPTION',
            ShippingAddress: shippingAddress,
          });
      const response = await axios.post(
        'https://api.sandbox.vm.co.mz/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: 'YOUR_BUSINESS_SHORTCODE',
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: subtotalAmount,
          PartyA: contact,
          PartyB: 'YOUR_BUSINESS_SHORTCODE',
          PhoneNumber: contact,
          CallBackURL: 'YOUR_CALLBACK_URL',
          AccountReference: 'YOUR_ACCOUNT_REFERENCE',
          TransactionDesc: 'YOUR_TRANSACTION_DESCRIPTION',
          ShippingAddress: shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponse(response.data);
      setLoading(false);
      //remove items from list 
      //send shpping address to shopify as well as transaction data 
      //gnerate receipt to send to the client 
    } catch (error) {
      setError(error.response.data.errorMessage);
      setLoading(false);
    }
  };
  const handleShippingAddressChange = (event) => {
    setShippingAddress(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  return (
    <div className="flex flex-col mt-4">
      <form onSubmit={handleSubmit}>
        <input className="flex items-center justify-between" type="text" name="shippingAddress" value={shippingAddress} placeholder="Shipping Address" onChange={(e) => setShippingAddress(e.target.value)} />
        <br></br>
        <input className="flex items-center justify-between" type="text" name="contact" value={contact} placeholder="Contact"   onChange={(e) => setContact(e.target.value)}/>
       <br></br>
        <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded" disabled={loading}>
          {loading ? 'Loading...' : 'Pay with Mpesa'}
        </button>
      </form>

      {response && (
        <div className="mt-4 text-green-500">
          Payment successful. Payment ID: {response.paymentId}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

export default MpesaButton;
