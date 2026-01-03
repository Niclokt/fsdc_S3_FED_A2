import { google } from "googleapis";

export function getAuthClient() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        throw new Error(
            "GOOGLE_SERVICE_ACCOUNT_KEY is missing from environment variables"
        );
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    return new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
    );
}

export async function appendExpenseRow(expense) {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    if (!process.env.SPREADSHEET_ID) {
        throw new Error("SPREADSHEET_ID is missing from environment variables");
    }

    const values = [
        [
            expense.date,
            expense.amount,
            expense.description,
            expense.sourceOfPayment,
            expense.category || "",
        ],
    ];

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Sheet1!A:D", // adjust if your sheet has a different name
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
    });

    return response.data;
}
