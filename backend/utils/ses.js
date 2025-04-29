// backend/utils/ses.js
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: process.env.AWS_REGION });

/**
 * Send a basic email via SES.
 * @param {string} to
 * @param {string} subject
 * @param {string} htmlBody
 */
exports.sendEmail = async (to, subject, htmlBody) => {
  const params = {
    Source: process.env.SES_SOURCE_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: htmlBody } },
    },
  };
  return ses.sendEmail(params).promise();
};