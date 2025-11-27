// lib/db.ts
import sql from "mssql";

// Buat type manual karena mssql tidak punya deklarasi TypeScript
type MSSQLConfig = {
  user: string | undefined;
  password: string | undefined;
  server: string;
  port: number;
  database: string | undefined;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
};

const config: MSSQLConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Jangan pakai sql.ConnectionPool karena itu tidak ada type-nya
let pool: any = null;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// export async function queryDB(query: string) {
//   const pool = await getPool();
//   const result = await pool.request().query(query);
//   return result.recordset;
// }

export async function queryDB(query: string, params?: Record<string, any>) {
  const pool = await sql.connect(config);
  const request = pool.request();

  if (params) {
    for (const key in params) {
      request.input(key, params[key]);
    }
  }

  const result = await request.query(query);
  return result.recordset;
}
