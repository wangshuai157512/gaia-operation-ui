const proxy = require("http-proxy-middleware");
const express = require("express");
const app = express();

// const { HOST = "http://10.0.9.77:9042", PORT = "3300" } = process.env;

// app.set("port", PORT);

// app.use((req, res, next) => {
//     if (!req.timedout) next();
// });

app.use(express.static("./dist"));

// app.use(proxy("/", { target: HOST }));

app.listen(3000, () => {
  console.log(`server running @${app.get("port")}`);
});
