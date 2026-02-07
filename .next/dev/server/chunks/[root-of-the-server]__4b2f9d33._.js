module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[project]/404SquadSolarConnect/final/lib/auth-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "createAuthSession",
    ()=>createAuthSession,
    "getSessionUser",
    ()=>getSessionUser,
    "hashPassword",
    ()=>hashPassword,
    "requireRole",
    ()=>requireRole,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/jose/dist/node/esm/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const SESSION_COOKIE = "session_token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Missing JWT_SECRET");
    }
    return new TextEncoder().encode(secret);
}
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
async function createAuthSession(userId, role) {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.create({
        data: {
            token,
            userId,
            expiresAt
        }
    });
    const jwt = await new __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        token,
        role
    }).setProtectedHeader({
        alg: "HS256"
    }).setExpirationTime(expiresAt).sign(getSecret());
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE, jwt, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
        secure: ("TURBOPACK compile-time value", "development") === "production"
    });
    return token;
}
async function clearSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
            where: {
                token
            }
        });
    }
    cookieStore.delete(SESSION_COOKIE);
}
async function getSessionUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const jwt = cookieStore.get(SESSION_COOKIE)?.value;
    if (!jwt) return null;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(jwt, getSecret());
        const token = payload.token;
        if (!token) return null;
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
            where: {
                token
            },
            include: {
                user: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                isRejected: true
                            }
                        }
                    }
                }
            }
        });
        if (!session || session.expiresAt < new Date()) {
            return null;
        }
        if (session.user.status === "suspended") {
            await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
                where: {
                    token
                }
            });
            cookieStore.delete(SESSION_COOKIE);
            return null;
        }
        return session.user;
    } catch  {
        return null;
    }
}
function requireRole(userRole, allowed) {
    if (!allowed.includes(userRole)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden"
        }, {
            status: 403
        });
    }
    return null;
}
}),
"[project]/404SquadSolarConnect/final/app/api/auth/me/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/auth-server.ts [app-route] (ecmascript)");
;
;
async function GET() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    if (user.status === "suspended") {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearSession"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Account is suspended. Please contact support."
        }, {
            status: 403
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            phone: user.phone,
            address: user.address,
            profileImageUrl: user.profileImageUrl ?? null,
            role: user.role,
            verified: user.verified,
            organization: user.organization ? {
                id: user.organization.id,
                name: user.organization.name,
                isRejected: Boolean(user.organization.isRejected)
            } : null
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4b2f9d33._.js.map