import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
    try {
        const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, GROQ_API_KEY } = process.env;

        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !GROQ_API_KEY) {
            return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
        }

        const formData = await req.formData();
        const speechResult = formData.get("SpeechResult");
        const userInput = typeof speechResult === "string" ? speechResult.toLowerCase() : "";
        // const userInput = SpeechResult?.toLowerCase() || "";

        // 📌 Diccionario de respuestas rápidas
        const respuestasRapidas = {
            "ubicación": "Nuestra tienda está en la Avenida Principal 123, Ciudad Ejemplo.",
            "servicios": "Ofrecemos soporte técnico, instalación de software y venta de equipos.",
            "precios": "Nuestros precios varían según el servicio. ¿Qué necesitas saber exactamente?",
            "hablar con un representante": "Enseguida te transfiero con un agente. Un momento por favor."
        };

        let respuesta;
        let transferirLlamada = false;

        // 📌 Buscar palabras clave
        for (const clave in respuestasRapidas) {
            if (userInput.includes(clave)) {
                respuesta = respuestasRapidas[clave as "ubicación" | "servicios" | "precios" | "hablar con un representante"];
                if (clave === "hablar con un representante") {
                    transferirLlamada = true;
                }
                break;
            }
        }

        // 📌 Si no hay respuesta predefinida, usar Groq
        if (!respuesta) {
            const groq = new Groq({ apiKey: GROQ_API_KEY });

            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: userInput }],
                model: "llama3-8b-8192",
            });

            respuesta = completion.choices[0].message.content;
        }

        // 📌 Generar TwiML con opción de transferencia de llamada
        let twiml = `<Response><Say voice="alice" language="es-ES">${respuesta}</Say>`;

        if (transferirLlamada) {
            twiml += `<Dial>+1234567890</Dial>`; // 🔥 Cambia este número por el del representante
        } else {
            twiml += `
                <Gather input="speech" timeout="5" action="/api/twilio" method="POST">
                    <Say voice="alice" language="es-ES">¿Tienes otra pregunta?</Say>
                </Gather>
            `;
        }

        twiml += `</Response>`;

        return new NextResponse(twiml, { headers: { "Content-Type": "application/xml" } });
    } catch (err) {
        console.error("❌ Error en la API:", err);
        return NextResponse.json({ error: "Error en la solicitud" }, { status: 500 });
    }
}
