const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { route: "/" });
});

app.get("/create-post", (req, res) => {
  res.render("index", { route: "/create-post" });
});

app.post("/create-post", (req, res) => {
  const { title, content } = req.body;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});
