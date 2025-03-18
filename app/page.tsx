"use client"

import { useState } from "react";

export default function Home() {
  const [disabled, setDisabled] = useState(false);
  const handleCall = async () => {
    setDisabled(true);
    try {
      const response = await fetch("/api/incoming-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: "+1 787 378 7307" }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("📞 Llamada iniciada correctamente.");
      } else {
        alert(`❌ Error: ${data.error || "No se pudo iniciar la llamada"}`);
      }
    } catch (error) {
      console.error("❌ Error al hacer la solicitud:", error);
      alert("❌ Error al iniciar la llamada.");
    }
  };

  return (
    <main className="flex items-center justify-center bg-gray-600 h-screen w-screen">
      <button onClick={handleCall} disabled={disabled} className="bg-blue-700 px-4 py-2 rounded-md text-white">
        Llamar al +1 787 378 7307
      </button>
    </main>
  );
}
