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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/404SquadSolarConnect/final/lib/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "createSession",
    ()=>createSession,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getSession",
    ()=>getSession,
    "requireUser",
    ()=>requireUser,
    "serializeUser",
    ()=>serializeUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days
;
function serializeUser(user) {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return {
        ...safeUser,
        organization: user.organization ? {
            id: user.organization.id,
            name: user.organization.name,
            isRejected: Boolean(user.organization.isRejected)
        } : null
    };
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
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
    if (!session) {
        cookieStore.delete(SESSION_COOKIE);
        return null;
    }
    if (session.expiresAt < new Date()) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.delete({
            where: {
                token
            }
        });
        cookieStore.delete(SESSION_COOKIE);
        return null;
    }
    return session;
}
async function getCurrentUser() {
    const session = await getSession();
    return session ? serializeUser(session.user) : null;
}
async function createSession(userId) {
    const token = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.create({
        data: {
            token,
            userId,
            expiresAt
        }
    });
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/"
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
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("UNAUTHENTICATED");
    }
    return user;
}
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
"[project]/404SquadSolarConnect/final/lib/services/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentUser",
    ()=>currentUser,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "registerUser",
    ()=>registerUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/auth-server.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    role: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "customer",
        "installer"
    ]),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    companyName: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
async function registerUser(input) {
    const data = registerSchema.parse(input);
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            email: data.email
        }
    });
    if (existing) {
        throw new Error("An account with this email already exists");
    }
    const passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(data.password, 10);
    let organizationId;
    if (data.role === "installer") {
        const organization = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].organization.create({
            data: {
                name: data.companyName || `${data.name}'s Solar`,
                description: data.description,
                verified: false
            }
        });
        organizationId = organization.id;
    }
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
        data: {
            email: data.email,
            name: data.name,
            role: data.role,
            status: "active",
            phone: data.phone,
            address: data.address,
            passwordHash,
            organizationId,
            verified: data.role === "customer"
        },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                    isRejected: true
                }
            }
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthSession"])(user.id, user.role);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeUser"])(user);
}
async function loginUser(input) {
    const data = loginSchema.parse(input);
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            email: data.email
        },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                    isRejected: true
                }
            }
        }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isValid = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(data.password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthSession"])(user.id, user.role);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeUser"])(user);
}
async function logoutUser() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearSession"])();
}
async function currentUser() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])();
    if (!user) return null;
    const fullUser = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: user.id
        },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                    isRejected: true
                }
            }
        }
    });
    return fullUser ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeUser"])(fullUser) : null;
}
}),
"[project]/404SquadSolarConnect/final/lib/fees.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFees",
    ()=>getFees,
    "updateFees",
    ()=>updateFees
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const FEES_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "fees.json");
const DEFAULT_FEES = {
    siteVisitFee: 1200
};
async function ensureFeesFile() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(FEES_PATH);
        return;
    } catch  {}
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(FEES_PATH, JSON.stringify(DEFAULT_FEES, null, 2), "utf8");
}
async function getFees() {
    await ensureFeesFile();
    const content = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(FEES_PATH, "utf8");
    return JSON.parse(content);
}
async function updateFees(update) {
    const current = await getFees();
    const next = {
        ...current,
        ...update
    };
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(FEES_PATH, JSON.stringify(next, null, 2), "utf8");
    return next;
}
}),
"[project]/404SquadSolarConnect/final/app/api/applications/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/services/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$fees$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/fees.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const runtime = "nodejs";
/** Remove keys with undefined values (important for JSON fields) */ function removeUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v])=>v !== undefined));
}
function mapApplication(application) {
    const siteVisitInvoice = application.invoices?.find((invoice)=>invoice.type === "authority_fee" && invoice.description === "Site visit fee");
    const siteVisitFeePaid = siteVisitInvoice?.status === "paid";
    const normalizedStatus = siteVisitFeePaid && application.status === "pre_visit_approved" ? "site_visit_payment_completed" : application.status;
    return {
        id: application.reference,
        reference: application.reference,
        status: normalizedStatus,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        customerId: application.customerId,
        customerName: application.customer.name,
        email: application.customer.email,
        phone: application.customer.phone,
        address: application.customer.address,
        documents: application.documents,
        technicalDetails: application.technicalDetails,
        siteVisitDate: application.siteVisitDate,
        rejectionReason: application.rejectionReason,
        siteVisitFeePaid,
        selectedInstaller: application.installerOrganization ? {
            id: application.installerOrganization.id,
            name: application.installerOrganization.name,
            phone: application.installerOrganization.phone,
            address: application.installerOrganization.address,
            packageName: application.selectedPackage?.name,
            price: application.selectedPackage?.price
        } : undefined,
        bidId: application.bids[0]?.id,
        invoices: application.invoices
    };
}
async function GET() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const applications = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findMany({
        where: user.role === "customer" ? {
            customerId: user.id
        } : user.role === "installer" && user.organization ? {
            installerOrganizationId: user.organization.id
        } : undefined,
        include: {
            customer: true,
            installerOrganization: true,
            selectedPackage: true,
            bids: true,
            invoices: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        applications: applications.map(mapApplication)
    });
}
async function POST(request) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    if (user.role !== "customer") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Only customers can create applications"
        }, {
            status: 403
        });
    }
    let formData;
    try {
        formData = await request.formData();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid form data"
        }, {
            status: 400
        });
    }
    const metaRaw = formData.get("meta");
    if (!metaRaw || typeof metaRaw !== "string") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing application details"
        }, {
            status: 400
        });
    }
    // ✅ FIX: confirmSingleSystem exists here because you use it later
    const meta = JSON.parse(metaRaw);
    const uploadsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "uploads");
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(uploadsDir, {
        recursive: true
    });
    async function persistFile(field) {
        const file = formData.get(field);
        if (!file || typeof file === "string") return undefined;
        const f = file;
        const arrayBuffer = await f.arrayBuffer();
        const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(f.name || "") || ".bin";
        const storedName = `${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}${ext}`;
        const storedPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(uploadsDir, storedName);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(storedPath, Buffer.from(arrayBuffer));
        return {
            fileName: f.name,
            url: `/uploads/${storedName}`,
            uploadedAt: new Date().toISOString()
        };
    }
    const documents = {
        nic: await persistFile("nicDocument"),
        bankDetails: await persistFile("bankDetails"),
        electricityBill: await persistFile("electricityBill"),
        propertyDocument: await persistFile("propertyDocument")
    };
    const filteredDocuments = Object.fromEntries(Object.entries(documents).filter(([, value])=>value));
    const reference = `APP-${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])().slice(0, 8).toUpperCase()}`;
    const paidFee = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoice.findFirst({
        where: {
            customerId: user.id,
            type: "authority_fee",
            description: "Site visit fee",
            status: "paid"
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    const mode = new URL(request.url).searchParams.get("mode");
    const directPurchase = mode === "direct";
    if (!directPurchase && !meta.confirmSingleSystem) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "One application is limited to one solar system. Please confirm to proceed."
        }, {
            status: 400
        });
    }
    const include = {
        customer: true,
        installerOrganization: true,
        selectedPackage: true,
        bids: true,
        invoices: true
    };
    // Build technicalDetails without undefined values (JSON cannot contain undefined)
    const baseTech = meta.technicalDetails ?? {};
    const mergedTech = removeUndefined({
        ...baseTech,
        siteAddress: meta.siteAddress,
        systemCapacity: meta.systemCapacity,
        connectionPhase: meta.connectionPhase
    });
    // schema requires Json (not optional) so always set an object
    const technicalDetailsJson = mergedTech;
    const documentsJson = Object.keys(filteredDocuments).length > 0 ? filteredDocuments : {};
    // =========================
    // DIRECT PURCHASE FLOW
    // =========================
    if (directPurchase) {
        if (!meta.selectedPackageId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Package is required for direct purchase"
            }, {
                status: 400
            });
        }
        if (!meta.applicationId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Application is required for direct purchase"
            }, {
                status: 400
            });
        }
        const pendingPayment = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findFirst({
            where: {
                customerId: user.id,
                status: "payment_pending"
            }
        });
        if (pendingPayment && pendingPayment.reference !== meta.applicationId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Complete your pending payment before buying another package"
            }, {
                status: 409
            });
        }
        const pkg = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].installerPackage.findUnique({
            where: {
                id: meta.selectedPackageId
            }
        });
        if (!pkg) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Package not found"
            }, {
                status: 404
            });
        }
        // FIX: schema does NOT have pkg.active, so remove that check
        // If you need activation later, add a boolean field in schema.
        if (meta.installerOrganizationId && meta.installerOrganizationId !== pkg.organizationId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Installer does not match package"
            }, {
                status: 400
            });
        }
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findFirst({
            where: {
                reference: meta.applicationId,
                customerId: user.id
            },
            include
        });
        if (!existing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Application not found"
            }, {
                status: 404
            });
        }
        // FIX: use UncheckedUpdateInput so you can set FK scalar IDs
        const updateData = {
            status: "payment_pending",
            installerOrganizationId: pkg.organizationId,
            selectedPackageId: pkg.id,
            // Only update documents if new docs provided; otherwise keep existing
            ...Object.keys(filteredDocuments).length > 0 ? {
                documents: documentsJson
            } : {},
            // Always safe (JSON object)
            technicalDetails: technicalDetailsJson
        };
        const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.update({
            where: {
                id: existing.id
            },
            data: updateData,
            include
        });
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        const invoice = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoice.create({
            data: {
                applicationId: application.id,
                customerId: user.id,
                amount: pkg.price,
                description: "Installer payment",
                dueDate,
                status: "pending",
                type: "installation"
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            application: mapApplication(application),
            invoiceId: invoice.id
        }, {
            status: 201
        });
    }
    // =========================
    // NORMAL FLOW (SITE VISIT FEE)
    // =========================
    if (!paidFee) {
        let pendingApp = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findFirst({
            where: {
                customerId: user.id,
                status: "pending",
                siteVisitDate: null
            },
            orderBy: {
                createdAt: "desc"
            },
            include
        });
        if (pendingApp) {
            const updateData = {
                technicalDetails: technicalDetailsJson,
                ...Object.keys(filteredDocuments).length > 0 ? {
                    documents: documentsJson
                } : {}
            };
            pendingApp = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.update({
                where: {
                    id: pendingApp.id
                },
                data: updateData,
                include
            });
        } else {
            pendingApp = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.create({
                data: {
                    reference,
                    customerId: user.id,
                    status: "pending",
                    documents: documentsJson,
                    technicalDetails: technicalDetailsJson
                },
                include
            });
        }
        if (!pendingApp) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unable to create application"
            }, {
                status: 500
            });
        }
        if (mode === "fee") {
            const fees = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$fees$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFees"])();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            const invoice = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoice.create({
                data: {
                    applicationId: pendingApp.id,
                    customerId: user.id,
                    amount: fees.siteVisitFee,
                    description: "Site visit fee",
                    dueDate,
                    status: "pending",
                    type: "authority_fee"
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Payment required",
                invoiceId: invoice.id,
                applicationId: pendingApp.reference,
                paymentRequired: true
            }, {
                status: 402
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            application: mapApplication(pendingApp),
            paymentRequired: false
        }, {
            status: 201
        });
    }
    // =========================
    // NORMAL FLOW (FEE PAID -> CREATE NEW)
    // =========================
    const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.create({
        data: {
            reference,
            customerId: user.id,
            status: "pending",
            documents: documentsJson,
            technicalDetails: technicalDetailsJson
        },
        include
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        application: mapApplication(application)
    }, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7761415d._.js.map