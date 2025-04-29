// backend/utils/sns.js
const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: process.env.AWS_REGION });

/**
 * publishNotification
 * @param {{ subject: string, message: string }} opts
 * @returns {Promise<AWS.SNS.PublishResponse>}
 */
async function publishNotification({ subject, message }) {
  // build your params
  const params = {
    TopicArn: process.env.SNS_TOPIC_ARN,  // ← must be set in your .env
    Subject: subject,                      // must be a simple string
    Message: message,                      // must be a simple string
  };

  // debug-log what we’re sending
  console.log("📢 SNS.publish called with:", JSON.stringify(params, null, 2));

  // publish and log the result or the error
  try {
    const result = await sns.publish(params).promise();
    console.log("🔔 SNS publish success:", result);
    return result;
  } catch (err) {
    console.error("❌ SNS publish failed:", err);
    throw err;
  }
}

module.exports = { publishNotification };