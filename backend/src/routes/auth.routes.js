import {
  Router,
} from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import {
  protectRoute,
} from "../middleware/auth.middleware.js";

import {
  validateRegister,
  validateLogin,
} from "../middleware/validate.middleware.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new account and returns the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or username already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/register",
  validateRegister,
  registerUser,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates a user and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  validateLogin,
  loginUser,
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current user
 *     description: Invalidates the current user session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/logout",
  protectRoute,
  logoutUser,
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user
 *     description: Returns the currently authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/me",
  protectRoute,
  getCurrentUser,
);

export default router;