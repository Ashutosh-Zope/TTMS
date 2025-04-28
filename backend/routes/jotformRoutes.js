const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const axios = require('axios');
const upload = multer();

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

router.post('/webhook', upload.none(), async (req, res) => {
  try {
    console.log('📥 Full Form Data:', req.body);

    const formData = req.body;
    const prettyText = formData.pretty || '';
    const rawRequest = JSON.parse(formData.rawRequest || '{}');
    const attachmentUrls = rawRequest.attachments || [];

    // --- Extract individual fields from "pretty" ---
    const nameMatch = prettyText.match(/Name:(.*?),/);
    const emailMatch = prettyText.match(/E-mail:(.*?),/);
    const requestTypeMatch = prettyText.match(/Request Type:(.*?),/);
    const departmentMatch = prettyText.match(/Department:(.*?),/);
    const completionDateMatch = prettyText.match(/Requested Completion Date:(.*?),/);
    const priorityMatch = prettyText.match(/Priority:(.*?),/);
    const descriptionMatch = prettyText.match(/Request Description:(.*)/);

    const fullName = nameMatch ? nameMatch[1].trim() : '';
    const email = emailMatch ? emailMatch[1].trim() : '';
    const requestType = requestTypeMatch ? requestTypeMatch[1].trim() : '';
    const department = departmentMatch ? departmentMatch[1].trim() : '';
    const requestedCompletionDate = completionDateMatch ? completionDateMatch[1].trim() : '';
    const priority = priorityMatch ? priorityMatch[1].trim() : 'Low';
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    let uploadedFileUrl = '';

    // --- 📦 File upload handling ---
    if (attachmentUrls.length > 0) {
      const fileUrl = attachmentUrls[0];
      console.log('📎 Attachment URL:', fileUrl);

      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${process.env.JOTFORM_API_KEY}`,
        },
      });

      const contentType = response.headers['content-type'] || '';

      const allowedTypes = ['image/', 'application/octet-stream'];
      if (!allowedTypes.some(type => contentType.startsWith(type))) {
        throw new Error(`Downloaded file is not a valid file! Content-Type: ${contentType}`);
      }

      const rawFileName = fileUrl.split('/').pop();
      const decodedFileName = decodeURIComponent(rawFileName);
      const s3Key = `uploads/${Date.now()}-${decodedFileName}`;

      const uploadParams = {
        Bucket: 'ttma-bucket',
        Key: `ttms-agency/${s3Key}`,
        Body: response.data,
        ContentType: contentType,
      };

      const s3Result = await s3.upload(uploadParams).promise();
      uploadedFileUrl = s3Result.Location;
      console.log('✅ File uploaded to S3:', uploadedFileUrl);
    } else {
      console.warn('⚠️ No attachment found.');
    }

    // --- 🗂️ Save Ticket into DynamoDB ---
    const params = {
      TableName: 'TicketSystem-Tickets',
      Item: {
        ticketId: formData['submissionID'] || Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: `Request: ${requestType} by ${fullName}`,
        description: description,
        priority: priority,
        department: department,
        status: 'Open',
        tags: [requestType, department],
        userEmail: email,
        attachmentUrl: uploadedFileUrl || '',
      },
    };

    await dynamodb.put(params).promise();

    console.log('✅ Ticket and attachment saved successfully!');
    res.status(200).send('Ticket and file uploaded successfully!');
  } catch (err) {
    console.error('❌ Error processing webhook:', err.message);
    res.status(500).send(`Error: ${err.message}`);
  }
});

module.exports = router;
