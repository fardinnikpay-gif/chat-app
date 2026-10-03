import { useAuth } from "../../hooks/useAuth.js";
import { UserSearch } from "./UserSearch.jsx";
import { UserList } from "./UserList.jsx";

export function Sidebar() {
    const { user, logout } =
        useAuth();

    return (
        <aside className="flex h-full w-full max-w-sm flex-col border-r border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-gray-900">
                        Messages
                    </h1>

                    <p className="mt-1 truncate text-sm text-gray-500">
                        {user?.fullName}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    Logout
                </button>
            </div>

            <div className="border-b border-gray-200 p-4">
                <UserSearch />
            </div>

            <div className="min-h-0 flex-1">
                <UserList />
            </div>
        </aside>
    );
}