import "dotenv/config"; // Must be first line to load .env.local
import { appendExpenseRow } from "./utils/googleSheets.js";

async function test() {
    try {
        const result = await appendExpenseRow({
            date: new Date().toISOString().split("T")[0],
            amount: 12.34,
            category: "Food",
            description: "Test row from Node",
        });

        console.log("✅ Row added successfully!", result);
    } catch (error) {
        console.error("❌ Error appending row:", error);
    }
}

test();
