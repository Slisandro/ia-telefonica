import { NextResponse } from "next/server";
import Twilio from "twilio";

export async function POST() {
  const client = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const call = await client.calls.create({
      url: process.env.URL_PUBLIC + "/api/bot",
      to: "+542235396722", // Número destino
      from: "+16318142082", // Tu número de Twilio
    });

    return NextResponse.json({ success: true, call });
  } catch (err) {
    console.error("❌ Error al realizar la llamada:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
