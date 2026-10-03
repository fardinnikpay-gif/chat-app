import { Link } from "react-router";

export function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="text-center">
                <p className="text-8xl font-black text-blue-600">
                    404
                </p>

                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    Page not found
                </h1>

                <p className="mt-2 text-gray-500">
                    The page you are looking for does not exist.
                </p>

                <Link
                    to="/chat"
                    className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Go to chat
                </Link>
            </div>
        </main>
    );
}