// utils/ses.js
const AWS = require("aws-sdk");

// 1.a Configure AWS with credentials & region
//    These will read from your environment variables.
AWS.config.update({ region: process.env.AWS_REGION });

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * Send an HTML email via SES.
 * @param {string} to     – recipient email address
 * @param {string} subject
 * @param {string} html   – HTML body
 */
async function sendEmail(to, subject, html) {
  const params = {
    Source: process.env.SES_FROM_ADDRESS,     // e.g. "no-reply@yourdomain.com"
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: { Html: { Data: html, Charset: "UTF-8" } },
    },
  };

  // SES.sendEmail returns a request object; .promise() makes it return a Promise.
  return ses.sendEmail(params).promise();
}

module.exports = { sendEmail };