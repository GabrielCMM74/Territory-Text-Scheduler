const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
const dotenv = require('dotenv').config();
const fs = require('fs');

const app = express();
const PORT = 3000;

// Read the schedule configuration
const schedule = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));

// Set up Twilio client
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

app.get('/', (req, res) => {
    res.send('Text Scheduler is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Test Route
app.get('/test', (req, res) => {
    twilioClient.messages.create({
        body: 'This is a test message from Text Scheduler!',
        from: TWILIO_PHONE_NUMBER,
        to: '+17049931383'  // Replace with your actual phone number for testing
    })
    .then(message => {
        console.log(message.sid);
        res.send('Test message sent!');
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Failed to send test message.');
    });
});
// End of Test Route 

// // Function to send a text message
// function sendTextMessage(name, number, message) {
//     twilioClient.messages.create({
//         body: message,
//         from: TWILIO_PHONE_NUMBER,
//         to: number
//     })
//     .then(message => {
//         console.log(`Message sent to ${name} with SID: ${message.sid}`);
//     })
//     .catch(error => {
//         console.error(`Failed to send message to ${name}. Error: ${error.message}`);
//     });
// }

// // Loop through the schedule and set up cron jobs
// for (let entry of schedule) {
//     const { startDate, endDate, name, number } = entry;

//     // Convert the date to EST and set the time to 8am or 8pm
//     const startDateTime = new Date(`${startDate}T08:00:00.000-05:00`);
//     const endDateTime = new Date(`${endDate}T20:00:00.000-05:00`);

//     // Schedule the start date message
//     cron.schedule(`${startDateTime.getMinutes()} ${startDateTime.getHours()} ${startDateTime.getDate()} ${startDateTime.getMonth() + 1} *`, () => {
//         sendTextMessage(name, number, `Hello ${name}, this is your start date message for the week of ${startDate} to ${endDate}.`);
//     });

//     // Schedule the end date message
//     cron.schedule(`${endDateTime.getMinutes()} ${endDateTime.getHours()} ${endDateTime.getDate()} ${endDateTime.getMonth() + 1} *`, () => {
//         sendTextMessage(name, number, `Hello ${name}, this is your end date message for the week of ${startDate} to ${endDate}.`);
//     });
// }

// // ... [rest of the code]