import { Sidebar } from "../components/chat/Sidebar.jsx";
import { ChatWindow } from "../components/chat/ChatWindow.jsx";

export function ChatLayout() {
    return (
        <div className="h-screen overflow-hidden bg-white">
            <div className="flex h-full">
                <Sidebar />

                <main className="min-w-0 flex-1">
                    <ChatWindow />
                </main>
            </div>
        </div>
    );
}