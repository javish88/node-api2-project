const express = require("express");

const postsRouter = require("./posts-router");

const server = express();

server.get("/", (req, res) => {
  res.send(`
    <h2>Pikachu</h2>
    <p>FFXIV is amazing</p>
  `);
});

server.use("/api/posts", postsRouter);

module.exports = server;