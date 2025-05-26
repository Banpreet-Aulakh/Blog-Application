const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const sortedPosts = posts
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.render("index", { route: "/", posts: sortedPosts });
});

app.get("/create-post", (req, res) => {
  res.render("index", { route: "/create-post" });
});

app.post("/create-post", (req, res) => {
  const { title, content } = req.body;
  const timestamp = new Date().toISOString();
  const postID = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const post = {
    id: postID,
    title: title,
    content: content,
    timestamp: timestamp,
  };
  posts.push(post);

  res.redirect("/");
});

app.post("/delete-post", (req, res) => {
  const { postId } = req.body;

  if (!postId || isNaN(parseInt(postId))) {
    return res.redirect("/");
  }

  const postIdNum = parseInt(postId);

  const postIndex = posts.findIndex((post) => post.id === postIdNum);

  if (postIndex === -1) {
    return res.redirect("/");
  }

  posts.splice(postIndex, 1);

  res.redirect("/");
});

app.get("/create-post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return res.redirect("/");
  }

  res.render("index", {
    route: `/create-post/${postId}`,
    postId: postId,
    post: post, 
  });
});

app.post("/create-post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.redirect("/");
  }

  posts[postIndex].title = title;
  posts[postIndex].content = content;
  posts[postIndex].timestamp = new Date().toISOString();

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});

let posts = [];
