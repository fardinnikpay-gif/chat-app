import path from "path";
import {
  fileURLToPath,
} from "url";

import swaggerJSDoc from "swagger-jsdoc";

const currentFile =
  fileURLToPath(import.meta.url);

const currentDirectory =
  path.dirname(currentFile);

const routesPath = path
  .resolve(
    currentDirectory,
    "../routes/**/*.js",
  )
  .replace(/\\/g, "/");

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Chat App API",
      version: "1.0.0",
      description:
        "API documentation for the MERN Chat Application.",
    },

    servers: [
      {
        url:
          "http://localhost:5000/api/v1",
        description:
          "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        RegisterInput: {
          type: "object",

          required: [
            "fullName",
            "email",
            "password",
          ],

          properties: {
            fullName: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              example: "Noor Ahmadi",
            },

            email: {
              type: "string",
              format: "email",
              example: "noor@example.com",
            },

            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "StrongPass123!",
            },
          },
        },
        LoginInput: {
          type: "object",

          required: [
            "email",
            "password",
          ],

          properties: {
            email: {
              type: "string",
              format: "email",
              example:
                "noor@example.com",
            },

            password: {
              type: "string",
              format: "password",
              example:
                "StrongPass123!",
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example:
                "Something went wrong.",
            },
          },
        },
      },
    },
  },

  apis: [
    routesPath,
  ],
};

export const swaggerSpec =
  swaggerJSDoc(
    swaggerOptions,
  );