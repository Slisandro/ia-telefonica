import { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const VoiceResponse = Twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Especificar español (España) con una voz femenina
  response.say({ voice: "alice", language: "es-ES" }, "Hola, bienvenido a nuestro servicio. Un momento por favor.");

  response.pause({ length: 2 });

  response.say({ voice: "alice", language: "es-ES" }, "¿En qué puedo ayudarte?");
  
  response.record({ maxLength: 30, playBeep: true });

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(response.toString());
}