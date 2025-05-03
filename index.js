import express from "express";
import dotenv from "dotenv";
import {
  pool,
  post_entry,
  get_entries,
  get_entry,
  update_entry,
  delete_entry,
} from "./database.js";
import bodyParser from "body-parser";

//Port for page.
const port = process.env.PORT || 3000;
const router = express.Router();

//initialize app
const app = express()
  .use(bodyParser.json()) // to support JSON-encoded bodies
  .use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true,
    })
  )
  .get("/", (req, res) => {
    res.send("Successful response.");
  })

  //Posts blog entry
  .post("/blog-entries", async (req, res) => {
    try {
      const { tittle, content, author } = req.body;
      const result = await post_entry(tittle, content, author);
      res.status(201).json({ message: "blog post added succesfully!" });
    } catch (err) {
      console.error("Error adding blog post:", "express error: " + err);
      res.status(400).json({ error: "Failed to add blog post" });
    }
  })

  //Gets all blog entries
  .get("/blog-entries", async (req, res) => {
    try {
      const [result] = await get_entries();
      res.status(200).json({ message: "ok", result });
    } catch (err) {
      console.error("Error getting entries:", "express error: " + err);
      res.status(400).json({ error: "Failed to add blog post" });
    }
  })

  //Gets specific blog entry with id number
  .get("/blog-entries/id", async (req, res) => {
    try {
      const { id } = req.body;
      const [result] = await get_entry(id);

      if ([result] == "") {
        res.status(404).json({ error: "blog entry is not found" });
        return;
      }

      res.status(200).json({ message: "Response Body:", result });
    } catch (err) {
      console.error("Error getting entries:", "express error: " + err);
      res.status(400).json({ error: "fatal error" });
    }
  })

  .put("/blog-entries/id", async (req, res) => {
    try {
      const { id, tittle, content, author } = req.body;
      const [result] = await update_entry(id, tittle, content, author);

      if ([result][0].affectedRows == 0) {
        res.status(404).json({ error: "blog entry is not found" });
        return;
      }

      res.status(200).json({ message: "ok:", result });
    } catch (err) {
      console.error("Error getting entries:", "express error: " + err);
      res.status(400).json({ error: "bad request" });
    }
  })

  .delete("/blog-entries/id", async (req, res) => {
    try {
      const { id } = req.body;
      const [result] = await delete_entry(id);

      if ([result][0].affectedRows == 0) {
        res.status(404).json({ error: "blog entry is not found" });
        return;
      }

      res.status(204).json();
    } catch (err) {
      console.error("Error getting entries:", "express error: " + err);
      res.status(400).json({ error: "fatal error" });
    }
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
