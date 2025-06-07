import { fetchWeatherApi } from "openmeteo";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const weatherURL = "https://api.open-meteo.com/v1/forecast";

function parseWeatherCode(code) {
  switch (parseInt(code)) {
    case 0: return "clear-day";
    case 1: return "mainly-clear-day"; 
    case 2: return "partly-cloudy-day";
    case 3: return "overcast";
    case 45: return "fog";
    case 48: return "fog"; 
    case 51: case 53: case 55: return "drizzle";
    case 56: case 57: return "drizzle"; 
    case 61: case 63: case 65: return "rain";
    case 66: case 67: return "rain"; 
    case 71: case 73: case 75: case 77: return "snow";
    case 80: case 81: case 82: return "rain";
    case 85: case 86: return "snow";
    case 95: case 96: case 99: return "thunderstorms";
    default: return "not-available";
  }
}

app.get("/", (req, res) => {
  const sortedPosts = posts
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.render("index", { route: "/", posts: sortedPosts, parseWeatherCode });
});

app.get("/create-post", (req, res) => {
  res.render("index", { route: "/create-post", parseWeatherCode });
});

app.post("/create-post", async (req, res) => {
  const { title, content, shareLocation, latitude, longitude } = req.body;
  const timestamp = new Date().toISOString();
  const postID = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

  const post = {
    id: postID,
    title: title,
    content: content,
    timestamp: timestamp,
  };
  if (shareLocation === "true" && latitude && longitude) {
    post.location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    console.log("Location data saved:", post.location);
    const weather = await getWeatherCode(post.location);
    if (weather && weather.current && weather.current().variables(0)) {
      post.weatherCode = weather.current().variables(0).value();
    }
    console.log("Weather code for new post:", post.weatherCode);
  } else {
    console.log("No location data provided or checkbox not checked");
  }

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

app.get("/edit-post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return res.redirect("/");
  }

  res.render("index", {
    route: `/edit-post/${postId}`,
    postId: postId,
    post: post,
    parseWeatherCode
  });
});

app.post("/edit-post/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, shareLocation, latitude, longitude } = req.body;

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.redirect("/");
  }

  posts[postIndex].title = title;
  posts[postIndex].content = content;
  posts[postIndex].timestamp = new Date().toISOString();

  if (shareLocation === "true" && latitude && longitude) {
    posts[postIndex].location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    console.log("Location data updated:", posts[postIndex].location);
    const weather = await getWeatherCode(posts[postIndex].location);
    if (weather && weather.current && weather.current().variables(0)) {
      posts[postIndex].weatherCode = weather.current().variables(0).value();
    }
    console.log(
      "Weather for updated post:",
      weather.current().variables(0).value()
    );
  } else {
    if (posts[postIndex].location) {
      delete posts[postIndex].location;
      delete posts[postIndex].weatherCode;
      console.log("Location data removed from post");
    }
  }

  console.log("Updated post:", posts[postIndex]);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});

let posts = [];

async function getWeatherCode(post) {
  const latitude = post.latitude;
  const longitude = post.longitude;

  const params = {
    latitude: latitude,
    longitude: longitude,
    current: "weather_code",
    forecast_days: 1,
  };

  try {
    const response = await fetchWeatherApi(weatherURL, params);
    return response[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}



