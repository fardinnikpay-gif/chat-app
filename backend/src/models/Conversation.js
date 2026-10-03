import mongoose, { Types } from "mongoose";


export function validateParticipants(participants){
    if(!Array.isArray(participants)){
        return false
    }

    if(participants.length !== 2 ){
        return false
    }


    const firstUserId = participants[0]?.toString()
    const secondUserId = participants[1]?.toString()

    if(!firstUserId || !secondUserId){
        return false
    }

    return firstUserId !== secondUserId
}



const conversationSchema = new mongoose.Schema(
    {
        participants: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            ],

            required: [
                true,
                "Conversation participants are required.",
            ],

            validate: {
                validator: validateParticipants,
                message:
                    "A conversation must contain exactly two different users.",
            },
        },

        participantKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            select: false,
        },

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


conversationSchema.pre(
    "validate",
    function prepareParticipantKey() {
        if (
            !Array.isArray(this.participants) ||
            this.participants.length !== 2
        ) {
            return;
        }

        this.participantKey = this.participants
            .map((participantId) => participantId.toString())
            .sort()
            .join(":");
    }
);
conversationSchema.index({
    lastMessageAt: -1,
});

/**
 * برای پیدا کردن گفت‌وگوهای یک کاربر.
 */
conversationSchema.index({
    participants: 1,
    lastMessageAt: -1,
});

export const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);