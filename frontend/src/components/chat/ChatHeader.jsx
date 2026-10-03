import { useChat } from "../../hooks/useChat.js";

export function ChatHeader() {
    const { selectedUser } =
        useChat();

    if (!selectedUser) {
        return null;
    }

    const initial =
        selectedUser.fullName
            ?.charAt(0)
            ?.toUpperCase() || "?";

    return (
        <header className="flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {initial}
            </div>

            <div className="min-w-0">
                <h2 className="truncate font-semibold text-gray-900">
                    {selectedUser.fullName}
                </h2>

                <p className="text-xs text-gray-500">
                    {selectedUser.email}
                </p>
            </div>
        </header>
    );
}