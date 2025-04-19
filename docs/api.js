module.exports.apiDocumentation1 = {
  openapi: "3.0.0",
  info: {
    title: "Bootcamp  & Course Learning Management System API",
    version: "1.0.0",
    description:
      "## Overview\n" +
      "A comprehensive API for managing bootcamps, courses, users, and reviews with advanced security features. This enterprise-grade solution provides complete management capabilities for educational platforms, featuring robust authentication, granular access control, and advanced data management.\n\n" +
      "## Key Features\n" +
      "- **JWT Authentication** with cookie-based token management\n" +
      "- **Two-Factor Authentication** for enhanced security\n" +
      "- **Role-Based Access Control** (user, publisher, admin roles)\n" +
      "- **Email Integration** for password resets and confirmations\n" +
      "- **Advanced Querying** with filtering, sorting, and pagination\n" +
      "- **Geospatial Search** for location-based bootcamp discovery\n" +
      "- **File Upload** system for bootcamp photos\n" +
      "- **Rating System** with automatic average calculations\n" +
      "- **Cost Tracking** with automatic tuition averaging\n" +
      "- **Security Middleware** including rate limiting, XSS protection, and MongoDB sanitization\n\n" +
      "## Core Modules\n" +
      "1. **Authentication** - Secure user authentication with JWT and 2FA\n" +
      "2. **User Management** - Admin-controlled user lifecycle management\n" +
      "3. **Bootcamps** - Complete bootcamp management with geospatial capabilities\n" +
      "4. **Courses** - Curriculum management with cost tracking and scholarships\n" +
      "5. **Reviews** - Rating system with automatic average calculations\n\n" +
      "## Security Architecture\n" +
      "- Secure JWT tokens stored in HTTP-only cookies\n" +
      "- Bcrypt password hashing with salt rounds\n" +
      "- Helmet for HTTP header security\n" +
      "- CORS enabled with strict origin control\n" +
      "- Rate limiting (100 requests/15 minutes)\n" +
      "- XSS attack protection\n" +
      "- MongoDB query sanitization\n" +
      "- CSRF protection via token validation\n" +
      "- SQL/NoSQL injection prevention\n" +
      "- File upload validation and size limits",
    contact: {
      name: "Richard Essuman",
      email: "ressuman001@gmail.com",
      url: "https://github.com/ressuman/DevCamper-Bootcamp-Backend-Directory-Project.git",
    },
  },
  termsOfService: "http://swagger.io/terms/",
  license: {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
  servers: [
    {
      url: "http://localhost:5193",
      description: "Local development server (HTTP)",
    },
    {
      url: "https://ressuman-devcamper-bootcamp-backend.onrender.com/",
      description: "Production server (HTTPS)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT token must be provided in the Authorization header as 'Bearer <token>' and match the token stored in the HTTP-only cookie.",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          role: {
            type: "string",
            enum: ["user", "publisher"],
            example: "user",
          },
          resetPasswordToken: { type: "string" },
          resetPasswordExpire: { type: "string", format: "date-time" },
          confirmEmailToken: { type: "string" },
          isEmailConfirmed: { type: "boolean", example: false },
          twoFactorEnable: { type: "boolean", example: false },
          twoFactorCode: { type: "string" },
          twoFactorCodeExpire: { type: "string", format: "date-time" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
        },
        description:
          "User object excluding sensitive fields like password and tokens.",
      },
      Bootcamp: {
        type: "object",
        properties: {
          _id: { type: "string", example: "5d713995b721c3bb38c1f5d0" },
          name: { type: "string", example: "Modern Tech Bootcamp" },
          slug: { type: "string", example: "modern-tech-bootcamp" },
          description: {
            type: "string",
            example: "Full stack development with modern technologies",
          },
          website: {
            type: "string",
            example: "https://www.modern-tech.com",
          },
          phone: { type: "string", example: "(555) 555-5555" },
          email: { type: "string", example: "info@modern-tech.com" },
          address: {
            type: "string",
            example: "123 Main St, Boston, MA",
          },
          location: {
            type: "object",
            properties: {
              type: { type: "string", example: "Point" },
              coordinates: {
                type: "array",
                items: { type: "number" },
                example: [-71.059773, 42.35843],
              },
              formattedAddress: {
                type: "string",
                example: "123 Main St, Boston, MA 02108, US",
              },
              street: { type: "string", example: "123 Main St" },
              city: { type: "string", example: "Boston" },
              state: { type: "string", example: "MA" },
              zipcode: { type: "string", example: "02108" },
              country: { type: "string", example: "US" },
            },
          },
          careers: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "Web Development",
                "Mobile Development",
                "Frontend Development",
                "Backend Development",
                "Full Stack Web Development",
                "Programming Languages",
                "Software Development",
                "Computer Science",
                "UI/UX",
                "Data Science",
                "Business",
                "Project Management",
                "Data Analysis",
                "Cloud Engineering",
                "Cloud Computing",
                "Software Engineering",
                "Artificial Intelligence",
                "Machine Learning",
                "Big Data",
                "Game Development",
                "Robotics",
                "Coding for Kids",
                "Cybersecurity",
                "Network Engineering",
                "IT Support",
                "Data Visualization",
                "Data Engineering",
                "Predictive Analytics",
                "Game Design",
                "Digital Marketing",
                "IT Management",
                "Software Testing",
                "Cloud Architecture",
                "Data Modeling",
                "Network Administration",
                "Database Management",
                "Data Warehousing",
                "Other",
              ],
            },
            example: ["Web Development", "Full Stack Web Development"],
          },
          averageRating: { type: "number", example: 8.5 },
          averageCost: { type: "number", example: 10000 },
          photo: {
            type: "string",
            example: "photo_5d713995b721c3bb38c1f5d0.jpg",
          },
          housing: { type: "boolean", example: true },
          jobAssistance: { type: "boolean", example: true },
          jobGuarantee: { type: "boolean", example: false },
          acceptGi: { type: "boolean", example: true },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
          user: {
            type: "string",
            example: "5d713995b721c3bb38c1f5d0",
          },
        },
      },
      BootcampRequest: {
        type: "object",
        required: ["name", "description", "address", "careers"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          website: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          careers: {
            type: "array",
            items: { type: "string" },
          },
          averageCost: { type: "number" },
          housing: { type: "boolean" },
          jobAssistance: { type: "boolean" },
          jobGuarantee: { type: "boolean" },
          acceptGi: { type: "boolean" },
        },
      },
      Course: {
        type: "object",
        properties: {
          _id: { type: "string", example: "5d725a037b292f5f8ceff789" },
          title: { type: "string", example: "Full Stack Web Development" },
          description: {
            type: "string",
            example:
              "Learn modern full stack development with Node.js and React",
          },
          weeks: { type: "string", example: "8" },
          tuition: { type: "number", example: 10000 },
          minimumSkill: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
            example: "intermediate",
          },
          scholarshipAvailable: { type: "boolean", example: true },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
          bootcamp: {
            type: "string",
            example: "5d713995b721c3bb38c1f5d0",
          },
          user: {
            type: "string",
            example: "5d713995b721c3bb38c1f5d0",
          },
        },
      },
      CourseRequest: {
        type: "object",
        required: ["title", "description", "weeks", "tuition", "minimumSkill"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          weeks: { type: "string" },
          tuition: { type: "number" },
          minimumSkill: { type: "string" },
          scholarshipAvailable: { type: "boolean" },
        },
      },
      Review: {
        type: "object",
        properties: {
          _id: { type: "string", example: "5d725a037b292f5f8ceff789" },
          title: { type: "string", example: "Great Learning Experience" },
          text: {
            type: "string",
            example: "The course content was excellent and well-structured",
          },
          rating: { type: "number", example: 9 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
          bootcamp: {
            type: "string",
            example: "5d713995b721c3bb38c1f5d0",
          },
          user: {
            type: "string",
            example: "5d713995b721c3bb38c1f5d0",
          },
        },
      },
      ReviewRequest: {
        type: "object",
        required: ["title", "text", "rating"],
        properties: {
          title: { type: "string" },
          text: { type: "string" },
          rating: { type: "number", minimum: 1, maximum: 10 },
        },
      },
      RegisterUser: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          role: {
            type: "string",
            enum: ["user", "publisher"],
            example: "user",
          },
        },
        description: "Schema for registering a new user.",
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", example: "password123" },
        },
        description: "Schema for user login.",
      },
      UpdateDetails: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", example: "John Updated" },
          email: { type: "string", example: "john.updated@example.com" },
        },
        description: "Schema for updating user details.",
      },
      UpdatePassword: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string", example: "password123" },
          newPassword: {
            type: "string",
            minLength: 6,
            example: "newpassword456",
          },
        },
        description: "Schema for updating user password.",
      },
      ForgotPassword: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", example: "john.doe@example.com" },
        },
        description: "Schema for initiating password reset.",
      },
      ResetPassword: {
        type: "object",
        required: ["password"],
        properties: {
          password: { type: "string", minLength: 6, example: "newpassword789" },
        },
        description: "Schema for resetting password with a token.",
      },
      VerifyTwoFactorCode: {
        type: "object",
        required: ["code"],
        properties: {
          code: { type: "string", example: "a1b2c3" },
        },
        description: "Schema for verifying two-factor authentication code.",
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          status: { type: "boolean", example: false },
          error: { type: "string", example: "Resource not found" },
        },
        description: "Generic error response schema.",
      },
      Pagination: {
        type: "object",
        properties: {
          next: {
            type: "object",
            properties: {
              page: { type: "integer", example: 2 },
              limit: { type: "integer", example: 25 },
            },
          },
          prev: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 25 },
            },
          },
        },
        description: "Pagination metadata for paginated responses.",
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid authentication token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Not authorized to access this route" },
          },
        },
      },
      Forbidden: {
        description: "Insufficient permissions",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "User role is not authorized" },
          },
        },
      },
    },
    parameters: {
      pageParam: {
        name: "page",
        in: "query",
        description: "Page number",
        schema: { type: "integer", default: 1 },
      },
      limitParam: {
        name: "limit",
        in: "query",
        description: "Items per page",
        schema: { type: "integer", default: 25 },
      },
      sortParam: {
        name: "sort",
        in: "query",
        description: "Sort by field",
        schema: { type: "string" },
      },
      zipcodeParam: {
        name: "zipcode",
        in: "path",
        required: true,
        schema: { type: "string", example: "02108" },
      },
      distanceParam: {
        name: "distance",
        in: "path",
        required: true,
        schema: { type: "number", example: 10 },
      },
      bootcampIdParam: {
        name: "bootcampId",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // Authentication Routes
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description:
          "Public route for user registration with email confirmation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "SecurePassword123!" },
                  role: { type: "string", example: "user" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate user and return JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "SecurePassword123!" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/v1/auth/logout": {
      get: {
        tags: ["Authentication"],
        summary: "Logout user",
        description: "Clear authentication cookie",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/currentUser": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user",
        description: "Get details of currently authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User details retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/auth/updateDetails": {
      put: {
        tags: ["Authentication"],
        summary: "Update user details",
        description: "Update name and email of authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                },
                required: ["name", "email"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Details updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/v1/auth/updatePassword": {
      put: {
        tags: ["Authentication"],
        summary: "Update password",
        description: "Update password for authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
                required: ["currentPassword", "newPassword"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/auth/forgotPassword": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset",
        description: "Initiate password reset process",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Reset email sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    data: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/resetPassword/{resetToken}": {
      put: {
        tags: ["Authentication"],
        summary: "Reset password",
        description: "Complete password reset process",
        parameters: [
          {
            name: "resetToken",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  password: { type: "string" },
                },
                required: ["password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/v1/auth/confirmEmail": {
      get: {
        tags: ["Authentication"],
        summary: "Confirm email",
        description: "Confirm user email address",
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Email confirmed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/v1/auth/sendTwoFactorCode": {
      post: {
        tags: ["Authentication"],
        summary: "Send 2FA code",
        description: "Send two-factor authentication code to user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "2FA code sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/verifyTwoFactorCode": {
      post: {
        tags: ["Authentication"],
        summary: "Verify 2FA code",
        description: "Verify two-factor authentication code",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "string" },
                },
                required: ["code"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "2FA verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },

    // User Routes
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve all users (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to select",
            schema: { type: "string" },
          },
          {
            name: "sort",
            in: "query",
            description: "Sort fields",
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    pagination: { type: "object" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        description: "Create new user (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get single user",
        description: "Get user by ID (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "User details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        description: "Update user details (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        responses: {
          200: {
            description: "User updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        description: "Delete user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "User deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Bootcamps Routes
    "/api/v1/bootcamps": {
      get: {
        tags: ["Bootcamps"],
        summary: "Get all bootcamps",
        description: "Public access to bootcamps with advanced filtering",
        parameters: [
          { $ref: "#/components/parameters/pageParam" },
          { $ref: "#/components/parameters/limitParam" },
          { $ref: "#/components/parameters/sortParam" },
          {
            name: "name",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "careers[in]",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "List of bootcamps",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Bootcamp" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bootcamps"],
        summary: "Create new bootcamp",
        description: "Create bootcamp (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BootcampRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Bootcamp created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bootcamp" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/bootcamps/radius/{zipcode}/{distance}": {
      get: {
        tags: ["Bootcamps"],
        summary: "Get bootcamps in radius",
        description: "Find bootcamps within specified distance from zipcode",
        parameters: [
          { $ref: "#/components/parameters/zipcodeParam" },
          { $ref: "#/components/parameters/distanceParam" },
        ],
        responses: {
          200: {
            description: "Bootcamps in radius",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Bootcamp" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/bootcamps/{id}/photo": {
      put: {
        tags: ["Bootcamps"],
        summary: "Upload bootcamp photo",
        description: "Upload bootcamp photo (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Photo uploaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/bootcamps/{id}": {
      get: {
        tags: ["Bootcamps"],
        summary: "Get single bootcamp",
        description: "Get bootcamp details by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Bootcamp details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bootcamp" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Bootcamps"],
        summary: "Update bootcamp",
        description: "Update bootcamp details (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BootcampRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Bootcamp updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bootcamp" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Bootcamps"],
        summary: "Delete bootcamp",
        description:
          "Delete bootcamp and associated courses/reviews (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Bootcamp deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    // Courses Routes
    "/api/v1/courses": {
      get: {
        tags: ["Courses"],
        summary: "Get all courses",
        description: "Public access to courses with filtering and pagination",
        parameters: [
          { $ref: "#/components/parameters/pageParam" },
          { $ref: "#/components/parameters/limitParam" },
          { $ref: "#/components/parameters/sortParam" },
          {
            name: "minimumSkill",
            in: "query",
            schema: {
              type: "string",
              enum: ["beginner", "intermediate", "advanced"],
            },
          },
        ],
        responses: {
          200: {
            description: "List of courses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Course" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/bootcamps/{bootcampId}/courses": {
      get: {
        tags: ["Courses"],
        summary: "Get courses for bootcamp",
        description: "Get all courses associated with a specific bootcamp",
        parameters: [{ $ref: "#/components/parameters/bootcampIdParam" }],
        responses: {
          200: {
            description: "List of courses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Course" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Courses"],
        summary: "Add course to bootcamp",
        description: "Add course to bootcamp (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/bootcampIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CourseRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Course created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/courses/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get single course",
        description: "Get course details by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Course details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Courses"],
        summary: "Update course",
        description: "Update course details (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CourseRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Course updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Courses"],
        summary: "Delete course",
        description: "Delete course (Publisher/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Course deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    // Reviews Routes
    "/api/v1/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get all reviews",
        description: "Public access to reviews with filtering and pagination",
        parameters: [
          { $ref: "#/components/parameters/pageParam" },
          { $ref: "#/components/parameters/limitParam" },
          { $ref: "#/components/parameters/sortParam" },
        ],
        responses: {
          200: {
            description: "List of reviews",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Review" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/bootcamps/{bootcampId}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for bootcamp",
        description: "Get all reviews associated with a specific bootcamp",
        parameters: [{ $ref: "#/components/parameters/bootcampIdParam" }],
        responses: {
          200: {
            description: "List of reviews",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Review" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Add review to bootcamp",
        description: "Add review to bootcamp (Authenticated Users only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/bootcampIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReviewRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Review created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Review" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/reviews/{id}": {
      get: {
        tags: ["Reviews"],
        summary: "Get single review",
        description: "Get review details by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Review details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Review" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Reviews"],
        summary: "Update review",
        description: "Update review details (Owner/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReviewRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Review updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Review" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Reviews"],
        summary: "Delete review",
        description: "Delete review (Owner/Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Review deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    status: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
  },
};
