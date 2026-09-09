const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [todos] = await db.query(
      "SELECT id, title, completed, created_at FROM todos ORDER BY id DESC"
    );
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [todos] = await db.query(
      "SELECT id, title, completed, created_at FROM todos WHERE id = ?",
      [req.params.id]
    );

    if (todos.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todos[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todo" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await db.query(
      "INSERT INTO todos (title, completed) VALUES (?, FALSE)",
      [title]
    );

    const [todos] = await db.query(
      "SELECT id, title, completed, created_at FROM todos WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(todos[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const completed = Boolean(req.body.completed);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await db.query(
      "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
      [title, completed, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const [todos] = await db.query(
      "SELECT id, title, completed, created_at FROM todos WHERE id = ?",
      [req.params.id]
    );

    res.json(todos[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM todos WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

module.exports = router;