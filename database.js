import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const post_entry = async (tittle, content, author) => {
  try {
    const result = await pool.query(
      `INSERT INTO blog.entries (tittle, content, author) VALUES ('${tittle}', '${content}', '${author}')`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.error("database error: " + err);
  }
};

const get_entries = async () => {
  try {
    const result = await pool.query(`SELECT * FROM blog.entries`);
    console.log(result);
    return result;
  } catch (err) {
    console.error("database error: " + err);
  }
};

const get_entry = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM blog.entries WHERE id = '${id}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.error("database error: " + err);
  }
};

const update_entry = async (id, tittle, content, author) => {
  try {
    var sqlQuery = "";
    var checkId = await pool.query(
      `SELECT * FROM blog.entries WHERE id = '${id}'`
    );

    if (!tittle == "") {
      sqlQuery = `tittle = '${tittle}'`;
    }

    if ((!tittle == "" && !content == "") || (!tittle == "" && !author == "")) {
      sqlQuery = sqlQuery + ", ";
    }

    if (!content == "") {
      sqlQuery = sqlQuery + `content = '${content}'`;
    }

    if (!content == "" && !author == "") {
      sqlQuery = sqlQuery + ", ";
    }

    if (!author == "") {
      sqlQuery = sqlQuery + `author = '${author}'`;
    }

    console.log(sqlQuery);

    const result = await pool.query(
      `UPDATE entries 
      SET ${sqlQuery}
      WHERE id = '${id}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.error("database error: " + err);
  }
};

const delete_entry = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM blog.entries WHERE id = '${id}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.error("database error: " + err);
  }
};

export { pool, post_entry, get_entries, get_entry, update_entry, delete_entry };
