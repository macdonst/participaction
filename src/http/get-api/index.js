const MessagingResponse = require("twilio").twiml.MessagingResponse;

exports.handler = async function http(req) {
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
