import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * کاراکترهای ویژه عبارت منظم را خنثی می‌کند.
 */
export function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * مقدار صفحه‌بندی را به عدد مثبت تبدیل می‌کند.
 */
export function parsePositiveInteger(value, fallbackValue) {
    const parsedValue = Number.parseInt(value, 10);

    if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1
    ) {
        return fallbackValue;
    }

    return parsedValue;
}

/**
 * فیلتر دریافت کاربران را می‌سازد.
 */
export function buildUserFilter(currentUserId, search) {
    const filter = {
        _id: {
            $ne: currentUserId,
        },
    };

    if (!search) {
        return filter;
    }

    const safeSearch = escapeRegExp(search);

    filter.$or = [
        {
            fullName: {
                $regex: safeSearch,
                $options: "i",
            },
        },
        {
            email: {
                $regex: safeSearch,
                $options: "i",
            },
        },
    ];

    return filter;
}

/**
 * تمام کاربران به‌جز کاربر فعلی را دریافت می‌کند.
 */
export const getUsers = asyncHandler(async (req, res) => {
    const search =
        typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";

    const page = parsePositiveInteger(
        req.query.page,
        1
    );

    const requestedLimit = parsePositiveInteger(
        req.query.limit,
        20
    );

    // جلوگیری از دریافت تعداد بسیار زیاد کاربر در یک درخواست
    const limit = Math.min(requestedLimit, 50);

    const skip = (page - 1) * limit;

    const filter = buildUserFilter(
        req.user._id,
        search
    );

    const [users, totalUsers] = await Promise.all([
        User.find(filter)
            .select("_id fullName email createdAt")
            .sort({
                fullName: 1,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
        totalUsers / limit
    );

    return res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: {
            users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        },
    });
});