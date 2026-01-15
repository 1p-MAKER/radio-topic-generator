const key = "AIzaSyAWKtTK1vTRvCGbwGtWC-I6somHNgZM98w";

async function listModels() {
    console.log("Listing models via REST API...");
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();

        if (data.error) {
            console.error("❌ REST API Error:", data.error);
            return;
        }

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(` - ${m.name} (Supports: generateContent)`);
                } else {
                    console.log(` - ${m.name} (No generateContent support)`);
                }
            });
        } else {
            console.log("⚠️ No models found in response:", data);
        }

    } catch (e) {
        console.error("❌ Network or Fetch Error:", e.message);
    }
}

listModels();
