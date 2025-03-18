import { NextResponse } from "next/server";
import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;

export async function POST() {
  const client = Twilio(accountSid, authToken, {});
  try {
    client.calls.create({
      url: "https://handler.twilio.com/twiml/EH01a1d48e4ea9fdcad67416a404c5f25f",
      to: "+17873787307",
      from: "+16318142082",
    })
      .then(call => new NextResponse(JSON.stringify(call)))
      .catch(err => new NextResponse(JSON.stringify(err)))
  } catch (err) {
    return new NextResponse(JSON.stringify(err))
  }
}
