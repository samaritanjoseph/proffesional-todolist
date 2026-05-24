const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const verify = require('../middleware/verifyToken');
const User = require('../models/User');

// Helper to interact with Paystack API
const paystackApi = async (method, path, data = null) => {
  const url = `https://api.paystack.co${path}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(url, options);
  return response.json();
};

// @route   POST /api/subscriptions/initialize
// @desc    Initialize a premium subscription transaction
// @access  Private
router.post('/initialize', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Premium plan is set at 5000 NGN (amount in kobo)
    const amount = 5000 * 100;

    const data = {
      email: user.email,
      amount: amount,
      metadata: {
        userId: user._id,
        plan: 'premium',
      },
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription?verified=true`,
    };

    const result = await paystackApi('POST', '/transaction/initialize', data);

    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error('Paystack Initialize Error:', error);
    res.status(500).json({ message: "Server error during Paystack initialization" });
  }
});

// @route   GET /api/subscriptions/verify/:reference
// @desc    Verify a transaction and upgrade user
// @access  Private
router.get('/verify/:reference', verify, async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await paystackApi('GET', `/transaction/verify/${reference}`);

    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }

    if (result.data.status === 'success') {
      const userId = result.data.metadata.userId;
      
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        paystackCustomerId: result.data.customer.customer_code,
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active'
      });

      return res.json({ message: "Subscription activated successfully!" });
    }

    res.status(400).json({ message: "Transaction not successful" });
  } catch (error) {
    console.error('Paystack Verify Error:', error);
    res.status(500).json({ message: "Server error verifying transaction" });
  }
});

// @route   POST /api/subscriptions/webhook
// @desc    Handle Paystack Webhooks
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    
    // Verify signature using the raw body
    if (!req.rawBody) {
        return res.status(400).send("No raw body found");
    }
    const hash = crypto.createHmac('sha512', secret).update(req.rawBody).digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      
      // Handle successful charge
      if (event.event === 'charge.success') {
        const userId = event.data.metadata.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            isPremium: true,
            subscriptionStatus: 'active',
            subscriptionPlan: 'premium',
            paystackCustomerId: event.data.customer.customer_code
          });
        }
      }
      // Handle subscription disable or failure
      if (event.event === 'subscription.disable' || event.event === 'charge.failed') {
        const email = event.data.customer.email;
        if (email) {
          await User.findOneAndUpdate({ email }, {
            isPremium: false,
            subscriptionStatus: 'inactive'
          });
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
