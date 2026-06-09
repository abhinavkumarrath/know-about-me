// api/sentinelle.js
export default function handler(request, response) {
  // We only want to accept POST requests from your ESP32
  if (request.method === 'POST') {
    const payload = request.body;
    
    // This logs the data to your Vercel cloud console!
    console.log("[SENTINELLE CLOUD] Distress Signal Received:", payload);

    // Send a 200 OK success response back to the ESP32
    return response.status(200).json({ 
      status: "Success", 
      message: "Mission telemetry logged securely." 
    });
  } else {
    // Block anyone trying to load this API URL in a normal browser tab
    return response.status(405).json({ error: "Method Not Allowed" });
  }
}
