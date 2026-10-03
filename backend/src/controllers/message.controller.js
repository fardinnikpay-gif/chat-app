import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { getIO, getUserRoom, } from "../socket/socket.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export function createParticipantKey(firstUserId, secondUserId) {
    return [firstUserId.toString(), secondUserId.toString(),].sort().join(":");
}

/** * مقدار صفحه‌بندی را به عدد مثبت تبدیل می‌کند. */
export function parsePositiveInteger(value, fallbackValue) {
    const parsedValue = Number.parseInt(value, 10);
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        return fallbackValue;
    } return parsedValue;
}

/** * موجود بودن کاربر گیرنده را بررسی می‌کند. */
export async function ensureReceiverExists(receiverId) {
    const receiver = await User.findById(receiverId).select("_id fullName email").lean();
    if (!receiver) {
        throw new ApiError(404, "Receiver user was not found.");
    } return receiver;
}

/** * گفت‌وگوی موجود را برمی‌گرداند یا یک گفت‌وگوی جدید می‌سازد. */
export async function getOrCreateConversation(senderId, receiverId) {
    const participantKey = createParticipantKey(senderId, receiverId);
    const conversation = await Conversation.findOneAndUpdate({ participantKey, },
        { $setOnInsert: { participants: [senderId, receiverId,], participantKey, lastMessageAt: new Date(), }, },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, }); return conversation;
}

export function createPublicMessage(message) {

    return {
        id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
}

/** * تاریخچه پیام‌های میان کاربر فعلی و کاربر انتخاب‌شده را دریافت می‌کند. */
export const getMessages = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id; const receiverId = req.params.userId;
    if (currentUserId.toString() === receiverId.toString()) {
        throw new ApiError(400, "You cannot open a conversation with yourself.");
    }
    const receiver = await ensureReceiverExists(receiverId);
    const page = parsePositiveInteger(req.query.page, 1);
    const requestedLimit = parsePositiveInteger(req.query.limit, 30);
    const limit = Math.min(requestedLimit, 100);
    const skip = (page - 1) * limit;
    const participantKey = createParticipantKey(currentUserId, receiverId);
    const conversation = await Conversation.findOne({ participantKey, }).select("_id").lean();
    /* * اگر تاکنون پیامی میان دو کاربر وجود نداشته باشد، * آرایه خالی برگردانده می‌شود. */
    if (!conversation) {
        return res.status(200).json({
            success: true, message: "No conversation exists between these users.",
            data: {
                conversationId: null, receiver, messages: [], pagination: { page: 1, limit, totalMessages: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false, },
            },
        });
    }
    const messageFilter = { conversationId: conversation._id, };
    const [messages, totalMessages] = await Promise.all([Message.find(messageFilter).select("_id conversationId senderId receiverId text createdAt updatedAt").sort({ createdAt: -1, _id: -1, }).skip(skip).limit(limit).lean(), Message.countDocuments(messageFilter),]);
    /* * پیام‌ها از MongoDB به‌شکل جدید به قدیم گرفته می‌شوند. * برای نمایش در صفحه چت، ترتیب آن‌ها برعکس می‌شود. */
    messages.reverse();
    const totalPages = Math.ceil(totalMessages / limit);
    return res.status(200).json({ success: true, message: "Messages fetched successfully.", data: { conversationId: conversation._id, receiver, messages, pagination: { page, limit, totalMessages, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1, }, }, });
});


/**
 * پیام را ذخیره و لحظه‌ای برای گیرنده ارسال می‌کند.
 */
export const sendMessage = asyncHandler(
    async (req, res) => {
        const senderId = req.user._id;
        const receiverId =
            req.params.userId;

        const { text } = req.body;

        if (
            senderId.toString() ===
            receiverId.toString()
        ) {
            throw new ApiError(
                400,
                "You cannot send a message to yourself."
            );
        }

        const receiver =
            await ensureReceiverExists(
                receiverId
            );

        const conversation =
            await getOrCreateConversation(
                senderId,
                receiverId
            );

        const message =
            await Message.create({
                conversationId:
                    conversation._id,
                senderId,
                receiverId,
                text,
            });

        await Conversation.findByIdAndUpdate(
            conversation._id,
            {
                $set: {
                    lastMessage:
                        message._id,

                    lastMessageAt:
                        message.createdAt,
                },
            },
            {
                runValidators: true,
            }
        );

        const publicMessage =
            createPublicMessage(message);

        /*
         * پیام برای Room خصوصی گیرنده ارسال می‌شود.
         *
         * اگر گیرنده آفلاین باشد، خطایی ایجاد نمی‌شود؛
         * پیام همچنان در MongoDB ذخیره شده است.
         */
        getIO()
            .to(
                getUserRoom(receiverId)
            )
            .emit(
                "newMessage",
                publicMessage
            );

        return res.status(201).json({
            success: true,
            message:
                "Message sent successfully.",

            data: {
                receiver,
                message: publicMessage,
            },
        });
    }
);