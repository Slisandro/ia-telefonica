import { NextResponse } from "next/server";
import Twilio from "twilio";

export async function POST() {
  const VoiceResponse = Twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  response.say(
    { voice: "alice", language: "es-ES" },
    "Hola, bienvenido a nuestro servicio."
  );

  response.pause({ length: 2 });

  response.say(
    { voice: "alice", language: "es-ES" },
    "¿En qué puedo ayudarte?"
  );

  response.record({ maxLength: 30, playBeep: true });

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

export function GET() {
  return new NextResponse("Hola");
}
