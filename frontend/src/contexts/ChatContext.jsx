import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getUsers,
} from "../api/users.api.js";

import {
    getMessages,
    sendMessage as sendMessageApi,
} from "../api/messages.api.js";

import { useAuth } from "../hooks/useAuth.js";
import { useSocket } from "../hooks/useSocket.js";

import {
    getApiErrorMessage,
} from "../utils/getApiErrorMessage.js";


export const ChatContext =
    createContext(null);


export function ChatProvider({
    children,
}) {
    const {
        user,
        isAuthenticated,
    } = useAuth();

    const {
        socket,
        isConnected,
    } = useSocket();


    /*
     * =========================
     * STATE
     * =========================
     */

    const [users, setUsers] =
        useState([]);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [isLoadingUsers, setIsLoadingUsers] =
        useState(false);

    const [isLoadingMessages, setIsLoadingMessages] =
        useState(false);

    const [isSending, setIsSending] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [usersPage, setUsersPage] =
        useState(1);

    const [hasMoreUsers, setHasMoreUsers] =
        useState(true);


    /*
     * =========================
     * LOAD USERS
     * =========================
     */

    const loadUsers =
        useCallback(
            async ({
                search = "",
                page = 1,
            } = {}) => {

                if (!isAuthenticated) {
                    return [];
                }

                try {
                    setIsLoadingUsers(true);
                    setError(null);

                    const response =
                        await getUsers({
                            search,
                            page,
                            limit: 20,
                        });

                    const userList =
                        response.data.users || [];


                    if (page === 1) {
                        setUsers(userList);
                    } else {
                        setUsers(
                            (previous) => [
                                ...previous,
                                ...userList,
                            ]
                        );
                    }


                    setUsersPage(page);

                    setHasMoreUsers(
                        userList.length === 20
                    );


                    return userList;

                } catch (error) {

                    setError(
                        getApiErrorMessage(
                            error,
                            "Unable to load users."
                        )
                    );

                    return [];

                } finally {

                    setIsLoadingUsers(false);
                }
            },
            [isAuthenticated]
        );


    /*
     * =========================
     * LOAD MESSAGES
     * =========================
     *
     * این تابع باید قبل از selectUser
     * تعریف شود.
     */

    const loadMessages =
        useCallback(
            async (userId) => {

                if (!userId) {
                    return [];
                }

                try {

                    setIsLoadingMessages(true);
                    setError(null);

                    const response =
                        await getMessages(userId);


                    const messageList =
                        response?.data?.messages || [];


                    setMessages(messageList);


                    return messageList;

                } catch (error) {

                    const message =
                        getApiErrorMessage(
                            error,
                            "Unable to load messages."
                        );

                    setError(message);

                    setMessages([]);

                    return [];

                } finally {

                    setIsLoadingMessages(false);
                }
            },
            []
        );


    /*
     * =========================
     * SELECT USER
     * =========================
     */

    const selectUser =
        useCallback(
            async (userToSelect) => {

                if (!userToSelect?._id) {
                    return;
                }


                setSelectedUser(
                    userToSelect
                );

                setMessages([]);

                setError(null);


                await loadMessages(
                    userToSelect._id
                );
            },
            [loadMessages]
        );


    /*
     * =========================
     * SEND MESSAGE
     * =========================
     */

    const sendMessage =
        useCallback(
            async (text) => {

                if (
                    !selectedUser ||
                    !text?.trim()
                ) {
                    return {
                        success: false,
                        error: "Message cannot be empty.",
                    };
                }


                try {

                    setIsSending(true);
                    setError(null);


                    const response =
                        await sendMessageApi(
                            selectedUser._id,
                            text.trim()
                        );


                    const newMessage =
                        response?.data?.message;


                    if (!newMessage) {
                        throw new Error(
                            "Server did not return the sent message."
                        );
                    }


                    /*
                     * پیام را فوراً به UI اضافه می‌کنیم.
                     */

                    setMessages(
                        (previous) => {

                            const exists =
                                previous.some(
                                    (message) =>
                                        message._id ===
                                        newMessage._id
                                );


                            if (exists) {
                                return previous;
                            }


                            return [
                                ...previous,
                                newMessage,
                            ];
                        }
                    );


                    return {
                        success: true,
                        message: newMessage,
                    };


                } catch (error) {

                    const message =
                        getApiErrorMessage(
                            error,
                            "Unable to send message."
                        );


                    setError(message);


                    return {
                        success: false,
                        error: message,
                    };


                } finally {

                    setIsSending(false);
                }
            },
            [selectedUser]
        );


    /*
     * =========================
     * INCOMING SOCKET MESSAGE
     * =========================
     */

    const handleIncomingMessage =
        useCallback(
            (newMessage) => {

                if (!newMessage) {
                    return;
                }


                const senderId =
                    newMessage.sender?._id ||
                    newMessage.sender;


                const receiverId =
                    newMessage.receiver?._id ||
                    newMessage.receiver;


                const currentUserId =
                    user?._id;


                const selectedUserId =
                    selectedUser?._id;


                /*
                 * بررسی می‌کنیم پیام مربوط به
                 * گفت‌وگوی فعلی هست یا نه.
                 */

                const belongsToCurrentChat =
                    (
                        senderId === selectedUserId &&
                        receiverId === currentUserId
                    ) ||
                    (
                        senderId === currentUserId &&
                        receiverId === selectedUserId
                    );


                if (!belongsToCurrentChat) {
                    return;
                }


                setMessages(
                    (previous) => {

                        /*
                         * جلوگیری از دوبار اضافه شدن
                         * یک پیام.
                         */

                        const exists =
                            previous.some(
                                (message) =>
                                    message._id ===
                                    newMessage._id
                            );


                        if (exists) {
                            return previous;
                        }


                        return [
                            ...previous,
                            newMessage,
                        ];
                    }
                );
            },
            [
                user,
                selectedUser,
            ]
        );


    /*
     * =========================
     * CLEAR CHAT
     * =========================
     */

    const clearChat =
        useCallback(
            () => {

                setSelectedUser(null);
                setMessages([]);
                setError(null);

            },
            []
        );


    /*
     * =========================
     * RESET CHAT
     * =========================
     */

    const resetChat =
        useCallback(
            () => {

                setUsers([]);
                setSelectedUser(null);
                setMessages([]);

                setError(null);

                setUsersPage(1);
                setHasMoreUsers(true);

            },
            []
        );


    /*
     * =========================
     * LOAD USERS AFTER LOGIN
     * =========================
     */

    useEffect(
        () => {

            if (isAuthenticated) {

                loadUsers();

            } else {

                resetChat();
            }

        },
        [
            isAuthenticated,
            loadUsers,
            resetChat,
        ]
    );


    /*
     * =========================
     * SOCKET MESSAGE LISTENER
     * =========================
     */

    useEffect(
        () => {

            if (
                !socket ||
                !isConnected
            ) {
                return;
            }


            socket.on(
                "message:new",
                handleIncomingMessage
            );


            return () => {

                socket.off(
                    "message:new",
                    handleIncomingMessage
                );

            };

        },
        [
            socket,
            isConnected,
            handleIncomingMessage,
        ]
    );


    /*
     * =========================
     * CONTEXT VALUE
     * =========================
     */

    const value =
        useMemo(
            () => ({
                users,

                selectedUser,

                messages,


                isLoadingUsers,

                isLoadingMessages,

                isSending,


                error,


                usersPage,

                hasMoreUsers,


                loadUsers,

                selectUser,

                loadMessages,

                sendMessage,


                clearChat,

                resetChat,
            }),

            [
                users,

                selectedUser,

                messages,


                isLoadingUsers,

                isLoadingMessages,

                isSending,


                error,


                usersPage,

                hasMoreUsers,


                loadUsers,

                selectUser,

                loadMessages,

                sendMessage,


                clearChat,

                resetChat,
            ]
        );


    /*
     * =========================
     * PROVIDER
     * =========================
     */

    return (
        <ChatContext.Provider
            value={value}
        >
            {children}
        </ChatContext.Provider>
    );
}

