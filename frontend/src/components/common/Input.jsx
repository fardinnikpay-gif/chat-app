export function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
    required = false,
    error = "",
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                    error
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } disabled:cursor-not-allowed disabled:bg-gray-100`}
                {...props}
            />

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}