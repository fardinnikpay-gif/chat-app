export function ErrorMessage({
    message,
    onClose,
}) {
    if (!message) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{message}</p>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 font-semibold text-red-600 hover:text-red-800"
                >
                    ×
                </button>
            )}
        </div>
    );
}