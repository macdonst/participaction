const MessagingResponse = require("twilio").twiml.MessagingResponse;
const arc = require("@architect/functions");
const parseBody = arc.http.helpers.bodyParser;

const shouldValidate = process.env.NODE_ENV !== "testing";

exports.handler = async function http(req) {
  // Validate the webhook
  if (shouldValidate) {
    if (!req.headers["x-twilio-signature"]) {
      return {
        headers: {
          "content-type": "text/plain",
        },
        statusCode: 400,
        body: "No signature header error - x-twilio-signature header does not exist, maybe this request is not coming from Twilio.",
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

  // Parse the POST body
  const data = parseBody(req);
  // Get what the user texted us
  const incomingText = data.Body;

  // Create the response
  const twiml = new MessagingResponse();
  twiml.message(`I received ${incomingText}`);

  return {
    headers: {
      "content-type": "text/xml",
    },
    statusCode: 200,
    body: twiml.toString(),
  };
};
