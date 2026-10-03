import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [
                true,
                "Conversation ID is required.",
            ],
            index: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Sender ID is required.",
            ],
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Receiver ID is required.",
            ],
        },

        text: {
            type: String,
            required: [
                true,
                "Message text is required.",
            ],
            trim: true,
            minlength: [
                1,
                "Message cannot be empty.",
            ],
            maxlength: [
                2000,
                "Message cannot exceed 2000 characters.",
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * جلوگیری از ارسال پیام توسط کاربر به خودش.
 */
messageSchema.pre(
    "validate",
    function validateMessageUsers() {
        if (!this.senderId || !this.receiverId) {
            return;
        }

        const senderId = this.senderId.toString();
        const receiverId = this.receiverId.toString();

        if (senderId === receiverId) {
            this.invalidate(
                "receiverId",
                "You cannot send a message to yourself."
            );
        }
    }
);

/**
 * برای دریافت پیام‌های یک گفت‌وگو براساس زمان.
 */
messageSchema.index({
    conversationId: 1,
    createdAt: 1,
});

/**
 * برای دریافت پیام‌های ارسال‌شده و دریافت‌شده کاربر.
 */
messageSchema.index({
    receiverId: 1,
    createdAt: -1,
});

export const Message = mongoose.model(
    "Message",
    messageSchema
);