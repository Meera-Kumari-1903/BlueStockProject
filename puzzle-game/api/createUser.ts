import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { uid, name, email, photo } = req.body;

    await pool.query(
      `INSERT INTO users(id, name, email, photo_url)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (email) DO NOTHING`,
      [uid, name, email, photo]
    );

    return res.status(200).json({ message: "User saved" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }
}
