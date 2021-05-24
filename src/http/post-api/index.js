const MessagingResponse = require("twilio").twiml.MessagingResponse;
const arc = require("@architect/functions");
const parseBody = arc.http.helpers.bodyParser;

const shouldValidate = process.env.NODE_ENV !== "testing";

const clues = {
  start: {
    message: `Welcome to the Amazing Socially Distanced Race! Follow the clues to find each of our 9 stations. Each station will be marked with a Community Better sign like the picture accompanying this text. Text 1234 to get your first clue.`,
    media: "https://stars-v27-staging.begin.app/_static/participaction.png",
  },
  1234: `Your first clue is "Watts happening where the Aero flies?"`,
};

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
  const incomingText = data.Body.toLowerCase().trim();

  // Create the response
  const twiml = new MessagingResponse();
  const message = twiml.message();
  if (clues[incomingText]) {
    message.body(clues[incomingText].message);
    if (clues[incomingText].media) {
      message.media(clues[incomingText].media);
    }
  } else {
    message.body(
      "Double check what you've typed as we don't have a matching clue!"
    );
  }

  return {
    headers: {
      "content-type": "text/xml",
    },
    statusCode: 200,
    body: twiml.toString(),
  };
};
