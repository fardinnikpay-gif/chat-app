import { useAuth } from "../../hooks/useAuth.js";

export function MessageBubble({
    message,
}) {
    const { user } =
        useAuth();

    const senderId =
        message.sender?._id ||
        message.sender;

    const isMine =
        senderId === user?._id;

    return (
        <div
            className={`flex ${
                isMine
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMine
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md bg-gray-100 text-gray-900"
                }`}
            >
                <p className="break-words text-sm leading-6">
                    {message.text}
                </p>

                <p
                    className={`mt-1 text-[10px] ${
                        isMine
                            ? "text-blue-100"
                            : "text-gray-400"
                    }`}
                >
                    {formatTime(
                        message.createdAt
                    )}
                </p>
            </div>
        </div>
    );
}

function formatTime(date) {
    if (!date) {
        return "";
    }

    return new Date(
        date
    ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}