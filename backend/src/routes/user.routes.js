import { Router } from "express";

import {
    getUsers,
} from "../controllers/user.controller.js";

import {
    protectRoute,
} from "../middleware/auth.middleware.js";

const router = Router();


/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Returns all users except the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    "/",
    protectRoute,
    getUsers
);

export default router;