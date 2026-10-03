import { useEffect, useState } from "react";

import { useChat } from "../../hooks/useChat.js";

export function UserSearch() {
    const { loadUsers } =
        useChat();

    const [search, setSearch] =
        useState("");

    useEffect(() => {
        const timer =
            setTimeout(() => {
                loadUsers({
                    search: search.trim(),
                    page: 1,
                });
            }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search, loadUsers]);

    return (
        <div className="relative">
            <input
                type="search"
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
                placeholder="Search users..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}