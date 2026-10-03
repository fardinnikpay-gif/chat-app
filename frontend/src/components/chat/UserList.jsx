import { useChat } from "../../hooks/useChat.js";

import { UserItem } from "./UserItem.jsx";

export function UserList() {
    const {
        users,
        isLoadingUsers,
        selectedUser,
    } = useChat();

    if (isLoadingUsers && users.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-sm text-gray-500">
                    No users found.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            {users.map((user) => (
                <UserItem
                    key={user._id}
                    user={user}
                    isSelected={
                        selectedUser?._id ===
                        user._id
                    }
                />
            ))}
        </div>
    );
}