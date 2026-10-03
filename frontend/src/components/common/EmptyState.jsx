export function EmptyState({
    title = "Nothing here",
    description = "",
    icon = "📭",
}) {
    return (
        <div className="flex h-full items-center justify-center px-6 py-10 text-center">
            <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {icon}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {title}
                </h3>

                {description && (
                    <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}