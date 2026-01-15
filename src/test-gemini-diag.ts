import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAmHbam8DsWaHYsoiXkYphuwDnREAsfhcc";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try a simple generation to see if we can get a clearer error or success.
        // Actually, for list models we might need to use the API endpoint directly if SDK doesn't expose it easily in this version.
        // Let's try to generate with a model I suspect SHOULD exist.

        console.log("Testing gemini-1.5-flash...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hello");
            console.log("Success with gemini-1.5-flash");
        } catch (e) {
            console.log("Failed gemini-1.5-flash:", e.message);
        }

        console.log("Testing gemini-pro...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("Hello");
            console.log("Success with gemini-pro");
        } catch (e) {
            console.log("Failed gemini-pro:", e.message);
        }

        console.log("Testing gemini-1.0-pro...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" }).generateContent("Hello");
            console.log("Success with gemini-1.0-pro");
        } catch (e) {
            console.log("Failed gemini-1.0-pro:", e.message);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

listModels();
