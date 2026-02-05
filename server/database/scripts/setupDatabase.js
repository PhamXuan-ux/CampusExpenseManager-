const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

(async () => {
  try {
    const sqlPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    console.log("Đang chạy SQL script để tạo lại database và bảng...");
    await connection.query(sql);
    console.log("Hoàn tất: Database và bảng đã được tạo/cập nhật.");

    await connection.end();
  } catch (err) {
    console.error("Lỗi khi chạy setupDatabase.js:", err);
    process.exit(1);
  }
})();
