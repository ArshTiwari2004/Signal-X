const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { accountSid, authToken, twilioPhoneNumber } = require("../config/dotenv");

const client = new twilio(accountSid, authToken);

router.post("/send-alert", async (req, res) => {
  const { phone, message } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone, // Your mobile number
    });

    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
