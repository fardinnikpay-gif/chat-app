import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import {
  env,
} from "./config/env.js";

import {
  swaggerSpec,
} from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";

export function registerMiddlewares(
  app,
) {
  app.use(helmet());

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );

  app.use(
    express.json({
      limit: "10kb",
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: "10kb",
    }),
  );

  app.use(cookieParser());

  if (
    env.nodeEnv ===
    "development"
  ) {
    app.use(morgan("dev"));
  }
}

export function registerRoutes(
  app,
) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerSpec,
      {
        explorer: true,

        swaggerOptions: {
          persistAuthorization: true,
        },
      },
    ),
  );

  app.get(
    "/api/v1/health",
    (req, res) => {
      return res.status(200).json({
        success: true,
        message:
          "Chat API is running.",

        data: {
          environment:
            env.nodeEnv,

          timestamp:
            new Date().toISOString(),
        },
      });
    },
  );

  app.use(
    "/api/v1/auth",
    authRoutes,
  );

  app.use(
    "/api/v1/users",
    userRoutes,
  );

  app.use(
  "/api/v1/messages",
  messageRoutes,
);
}

export function registerErrorHandlers(
  app,
) {
  app.use(notFound);
  app.use(errorHandler);
}

export function createApp() {
  const app = express();

  registerMiddlewares(app);
  registerRoutes(app);
  registerErrorHandlers(app);

  return app;
}