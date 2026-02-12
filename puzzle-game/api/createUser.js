"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        const { uid, name, email, photo } = req.body;
        if (!uid || !email) {
            return res.status(400).json({ message: "Missing user data" });
        }
        await pool.query(`INSERT INTO users(id, name, email, photo_url)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (email) DO NOTHING`, [uid, name, email, photo]);
        return res.status(200).json({ message: "User saved" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}
