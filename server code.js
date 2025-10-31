require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const Emission = mongoose.model('Emission', {
  activity: String,
  value: Number,
  date: Date
});

app.post('/api/calculate', async (req, res) => {
  const { activityType, amount } = req.body;

  const response = await axios.post('https://beta3.api.climatiq.io/estimate', {
    emission_factor: { activity_id: activityType },
    parameters: { value: amount, unit: 'km' }
  }, {
    headers: { Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}` }
  });

  const emission = new Emission({
    activity: activityType,
    value: response.data.co2e,
    date: new Date()
  });

  await emission.save();
  res.json(emission);
});

app.get('/api/emissions', async (req, res) => {
  const data = await Emission.find().sort({ date: -1 }).limit(30);
  res.json(data);
});

app.listen(5000, () => console.log('Server running on port 5000'));