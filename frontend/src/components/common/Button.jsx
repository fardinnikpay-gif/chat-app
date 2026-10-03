export function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}