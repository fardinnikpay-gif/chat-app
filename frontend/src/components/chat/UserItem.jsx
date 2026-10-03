import { useChat } from "../../hooks/useChat.js";

export function UserItem({
    user,
    isSelected = false,
}) {
    const { selectUser } =
        useChat();

    const initial =
        user?.fullName
            ?.charAt(0)
            ?.toUpperCase() || "?";

    return (
        <button
            type="button"
            onClick={() =>
                selectUser(user)
            }
            className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition ${
                isSelected
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
            }`}
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {initial}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                    {user.fullName}
                </p>

                <p className="truncate text-sm text-gray-500">
                    {user.email}
                </p>
            </div>
        </button>
    );
}