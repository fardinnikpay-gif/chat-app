import { useEffect, useRef } from "react";

import { useChat } from "../../hooks/useChat.js";
import { MessageBubble } from "./MessageBubble.jsx";

export function MessageList() {
    const {
        messages,
        isLoadingMessages,
        selectedUser,
    } = useChat();

    const messagesEndRef =
        useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    if (!selectedUser) {
        return null;
    }

    if (isLoadingMessages) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
        );
    }

    if (!messages.length) {
        return (
            <div className="flex flex-1 items-center justify-center px-6 text-center">
                <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                        💬
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                        Start a conversation
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Send a message to{" "}
                        {selectedUser.fullName}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="mx-auto flex max-w-4xl flex-col gap-3">
                {messages.map(
                    (message) => (
                        <MessageBubble
                            key={
                                message._id
                            }
                            message={
                                message
                            }
                        />
                    )
                )}

                <div
                    ref={
                        messagesEndRef
                    }
                />
            </div>
        </div>
    );
}