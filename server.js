// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const { rateLimit } = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
// const {
//   apiDocumentation,
//   apiDocumentation1,
//   apiDocumentation2,
// } = require("./docs/api");

// Import the database connection function
const connectDB = require("./config/db");

// Load environment variables from the config.env file
dotenv.config({ path: "./config/config.env" });

// Connect to the MongoDB database
connectDB();

// Import route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const errorHandler = require("./middlewares/error");
//const { requestLogger } = require("./middlewares/logger");
//const logger = require("./middlewares/logger");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const { apiDocumentation1 } = require("./docs/api");

const swaggerDocs = apiDocumentation1;

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const app = express();

// Body parser middleware to parse JSON requests
app.use(express.json());

// Cookie parser middleware to parse cookies
app.use(cookieParser());

// Development logging middleware using morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// // Alternatively, using a custom logger or winston logger
// if (process.env.NODE_ENV === "development") {
//   app.use(requestLogger);
// }
// // Using custom logger OR
// if (process.env.NODE_ENV === "development") {
//   app.use(logger);
// }

// File uploading middleware
app.use(fileupload());

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

// Setting various HTTP headers for security
app.use(helmet());

// Preventing Cross-site scripting (XSS) attacks
app.use(xss());

// Rate limiting middleware to limit requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Preventing HTTP parameter pollution
app.use(hpp());

// Enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());

app.get("/", (request, response) => {
  response.json({
    success: true,
    message: "Welcome to the Bootcamp LMS API",
    description:
      "A comprehensive learning management system for technical education programs, providing endpoints for managing bootcamps, courses, user accounts, reviews, and authentication systems.",
    status: {
      operational: true,
      uptime: `${process.uptime().toFixed(2)} seconds`,
      environment: process.env.NODE_ENV || "development",
      serverTime: new Date().toISOString(),
      memoryUsage: `${Math.round(
        process.memoryUsage().rss / 1024 / 1024
      )} MB RSS`,
    },
    documentation: {
      swagger: `${request.protocol}://${request.get("host")}/api-docs`,
      repository:
        "https://github.com/ressuman/DevCamper-Bootcamp-Backend-Directory-Project.git",
      versioning: {
        api: "1.0.0",
        node: process.version,
        compatibility: "Express 4.x | MongoDB 6.x+",
      },
    },
    features: [
      "JWT Authentication with cookie-based sessions",
      "Role-Based Access Control (RBAC)",
      "Two-Factor Authentication (2FA)",
      "Geospatial queries for bootcamp locations",
      "Advanced filtering/pagination/sorting",
      "File upload system for bootcamp photos",
      "Automated rating/cost calculations",
      "Email integration for account services",
    ],
    maintainer: {
      name: "Richard Essuman",
      email: "ressuman001@gmail.com",
      github: "https://github.com/ressuman",
      documentation:
        "https://github.com/ressuman/DevCamper-Bootcamp-Backend-Directory-Project/wiki",
    },
    security: {
      authentication: ["JWT", "2FA"],
      headers: ["Helmet", "CORS", "XSS-Protection"],
      rateLimiting: "100 requests/15 minutes",
      encryption: ["bcrypt", "TLS 1.3"],
    },
    system: {
      database: "MongoDB Atlas",
      cache: "Node.js in-memory",
      storage: "Local/Cloud file storage",
      monitoring:
        process.env.NODE_ENV === "production" ? "Enabled" : "Disabled",
    },
  });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);

// Mounting the routers
app.use("/api/v1/bootcamps", bootcamps); // Bootcamps routes
app.use("/api/v1/courses", courses); // Courses routes
app.use("/api/v1/auth", auth); // Authentication routes
app.use("/api/v1/users", users); // User routes
app.use("/api/v1/reviews", reviews); // Review routes

// Custom error handler middleware
app.use(errorHandler);

// Setting the port from environment variables or default to 5193
const PORT = process.env.PORT || 5193;

// Starting the server and listening on the specified port
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
      .yellow.bold.underline
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
