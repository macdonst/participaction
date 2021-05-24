const MessagingResponse = require("twilio").twiml.MessagingResponse;
const arc = require("@architect/functions");
const parseBody = arc.http.helpers.bodyParser;

const shouldValidate = process.env.NODE_ENV !== "testing";

const clues = {
  start: {
    message: `Welcome to the Amazing Socially Distanced Race! Follow the clues to find each of our 9 stations. Each station will be marked with a Community Better sign like the picture accompanying this text. Text 8637 to get your first clue.`,
    media: "https://stars-v27-staging.begin.app/_static/participaction.png",
  },
  8637: {
    message: `Your first clue is "Watts happening where the Aero flies?" When you find the Community Better sign text us the number on it to receive your first activity.`,
  },
  9215: {
    message: `You can choose between the following two activities #1: 10 lunges or #2: Countdown from 30 skipping every two (30, 28, 26…). When you are done text 8520 to get your next clue.`,
  },
  8520: {
    message: `"Travel down into West's Dale, there you will find the portal to green." Remember to look for the Community Better sign.`,
  },
  4273: {
    message: `Your choice! Activity #1: 20 jumping jacks or activity #2: dance like no one is watching for 30 seconds. When you are done text 8974 for your next clue`,
  },
  8974: {
    message: `Head to where the swimmers make a "racquet." You know what to do when you see the Community Better sign.`,
  },
  7198: {
    message: `For activity #1 pretend you are swimming for 30 seconds or activity #2 shout out the name of your favourite tennis player. All done? Text 1384 for your next clue`,
  },
  1384: {
    message: `Visit the corner where the Brook bends, here you will find the next number to send.`,
  },
  9538: {
    message: `Activity #1 do 10 toe touches (close as you can get) or #2 spot some wildlife, there are probably some bunnies hopping around. Text 1804 for your next clue`,
  },
  1804: {
    message: `From Herrington to Harlow the quick and easy way.`,
  },
  5809: {
    message: `Activity #1 skip the length of the path or #2 figure out which direction is north. Now text 6538 for another clue`,
  },
  6538: { message: `To Solva this clue, start the path to Crystalbayse` },
  6929: {
    message: `Activity #1 10 squats or #2 stop and smell the flowers on the way to your next clue which you can text 2953 to get.`,
  },
  2953: {
    message: `Try window shopping if you need grooming, a root canal, a tattoo or a smoothie.`,
  },
  6967: {
    message: `For activity #1 jog on the spot for 30 seconds or activity #2 check out some of the local businesses you may not have known about. Then text 9079 for another clue`,
  },
  9079: {
    message: `This intersection's name is in dis-array, unscramble the letters to find your way "cSyhloorda" and "emLegni"`,
  },
  3678: {
    message: `Activity #1 20 high knees or #2 Hold an overhead reach stretch for 20 seconds. Text 4483 for your final clue!`,
  },
  4483: {
    message: `Both a Park and a Place, there you will find the house of the same name.`,
  },
  2493: {
    message: `Look for the Community Better banner, take a selfie with it and email it to cblcaparksandrec@gmail.com to be entered in a draw for a Community Better prize. Congratulations! You've completed the Amazing Socially Distanced Race!`,
  },
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
