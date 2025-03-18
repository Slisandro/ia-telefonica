import { NextResponse } from "next/server";
import Twilio from "twilio";

export async function POST() {
  const client = Twilio(
    "ACf3e1333cfb9fd46bbae472ab05967fc6",
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const call = await client.calls.create({
      url: "https://handler.twilio.com/twiml/EH01a1d48e4ea9fdcad67416a404c5f25f",
      to: "+542235396722", // Número destino
      from: "+16318142082", // Tu número de Twilio
    });

    return NextResponse.json({ success: true, call });
  } catch (err) {
    console.error("❌ Error al realizar la llamada:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
