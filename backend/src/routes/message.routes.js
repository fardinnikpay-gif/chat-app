import { Router } from "express";

import {
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

import {
  protectRoute,
} from "../middleware/auth.middleware.js";

import {
  validateMessage,
  validateUserIdParam,
} from "../middleware/validate.middleware.js";

const router = Router();

/*
 * تمام Routeهای این فایل نیاز به ورود دارند.
 */
router.use(protectRoute);

/**
 * @openapi
 * /messages/{userId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get messages with a user
 *     description: Returns the message history between the logged-in user and another user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB ID of the other user
 *         schema:
 *           type: string
 *           example: 66b1e53f9e7a2f6b4c123456
 *     responses:
 *       200:
 *         description: Messages fetched successfully
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
 *                   example: Messages fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User or conversation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:userId",
  validateUserIdParam,
  getMessages,
);

/**
 * @openapi
 * /messages/{userId}:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send a message
 *     description: Sends a text message from the logged-in user to another user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB ID of the message receiver
 *         schema:
 *           type: string
 *           example: 66b1e53f9e7a2f6b4c123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageInput'
 *     responses:
 *       201:
 *         description: Message sent successfully
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
 *                   example: Message sent successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid user ID or message text
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Receiver user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:userId",
  validateUserIdParam,
  validateMessage,
  sendMessage,
);

export default router;