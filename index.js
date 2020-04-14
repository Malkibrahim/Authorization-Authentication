const express = require("express");
const router = require("./Routes/user");
require("express-async-errors");
require("./db");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/echo", (req, res, next) => {
  res.send("Hello world");
});
app.use("/user", router);
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    return res.status(statusCode).json({
      message: "something went wrong",
      type: "INTERNAL_SERVER_ERROR",
      details: [],
    });
  }
});
app.listen(port);
