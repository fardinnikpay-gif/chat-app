import { ChatHeader } from "./ChatHeader.jsx";
import { MessageList } from "./MessageList.jsx";
import { MessageInput } from "./MessageInput.jsx";

import { useChat } from "../../hooks/useChat.js";

export function ChatWindow() {
    const { selectedUser } =
        useChat();

    if (!selectedUser) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 px-6 text-center">
                <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                        💬
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Your messages
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Select a user from the
                        sidebar to start a
                        conversation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col bg-white">
            <ChatHeader />

            <MessageList />

            <MessageInput />
        </div>
    );
}