import { useState } from "react";

import { useChat } from "../../hooks/useChat.js";

export function MessageInput() {
    const {
        selectedUser,
        sendMessage,
        isSending,
    } = useChat();

    const [text, setText] =
        useState("");

    async function handleSubmit(
        event
    ) {
        event.preventDefault();

        const message =
            text.trim();

        if (
            !message ||
            isSending ||
            !selectedUser
        ) {
            return;
        }

        const result =
            await sendMessage(
                message
            );

        if (result.success) {
            setText("");
        }
    }

    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            event.currentTarget.form?.requestSubmit();
        }
    }

    if (!selectedUser) {
        return null;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 bg-white p-4"
        >
            <div className="mx-auto flex max-w-4xl items-end gap-3">
                <textarea
                    value={text}
                    onChange={(event) =>
                        setText(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    rows={1}
                    disabled={isSending}
                    placeholder="Write a message..."
                    className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={
                        isSending ||
                        !text.trim()
                    }
                    className="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSending
                        ? "..."
                        : "Send"}
                </button>
            </div>
        </form>
    );
}