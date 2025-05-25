const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const sortedPosts = posts.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.render("index", { route: "/", posts: sortedPosts });
});

app.get("/create-post", (req, res) => {
  res.render("index", { route: "/create-post" });
});

app.post("/create-post", (req, res) => {
  const { title, content } = req.body;
  const timestamp = new Date().toISOString();
  const postID = posts.length + 1;
  const post = {
    id: postID,
    title: title,
    content: content,
    timestamp: timestamp,
  };
  posts.push(post);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});

let posts = [];
