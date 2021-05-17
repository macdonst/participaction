const MessagingResponse = require("twilio").twiml.MessagingResponse;

const shouldValidate = process.env.NODE_ENV !== "testing";

exports.handler = async function http(req) {
  // Validate the webhook
  if (shouldValidate) {
    if (!req.headers["X-Twilio-Signature"]) {
      return {
        headers: {
          "content-type": "text/plain",
        },
        statusCode: 400,
        body: "No signature header error - X-Twilio-Signature header does not exist, maybe this request is not coming from Twilio.",
      };
    }
    if (!process.env.TWILIO_AUTH_TOKEN) {
      console.error(
        "[Twilio]: Error - Twilio auth token is required for webhook request validation."
      );
      return {
        headers: {
          "content-type": "text/plain",
        },
        statusCode: 500,
        body: "Webhook Error - we attempted to validate this request without first configuring our auth token.",
      };
    }
  }

  // Create the response
  const twiml = new MessagingResponse();
  twiml.message("The Robots are coming! Head for the hills!");

  return {
    headers: {
      "content-type": "text/xml",
    },
    statusCode: 200,
    body: twiml.toString(),
  };
};
