const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
dotenv.config();
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
// db
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => console.log("DB Connected"));
mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.get("/docs", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(helmet());
// routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api", postRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "Unauthorized!",
    });
  }
});
// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);
