const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const redis = require("redis");
const cors = require("cors");
const session = require("express-session");
const redisStore = require("connect-redis");

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

dotenv.config();

const {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

// ✅ Ensure SESSION_SECRET is set
if (!SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is missing! Set it in your .env file.");
  process.exit(1);
}

// Create Redis client
let redisClient = redis.createClient({
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT,
  },
});

// Listen for Redis connection event
redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

// Listen for Redis error event
redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("❌ Failed to connect to Redis:", err);
  process.exit(1); // Exit the process if Redis connection fails
});

const app = express();
const port = process.env.PORT || 5009;

// MongoDB Connection
const MONGO_URI = `mongodb://dockerdb:password@mongo:27017/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors( ))
app.use(
  session({
    store: new redisStore.RedisStore({
      client: redisClient, 
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Welcome to the Express Server");
  console.log("Yeah its running!!!")
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
