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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/404SquadSolarConnect/final/lib/stripe.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStripe",
    ()=>getStripe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
;
let stripeClient = null;
function getStripe() {
    if (stripeClient) return stripeClient;
    const mode = process.env.STRIPE_MODE?.toLowerCase();
    const sandboxKey = process.env.STRIPE_SANDBOX_SECRET_KEY;
    const isSandbox = mode === "sandbox" || mode === "test";
    const secret = isSandbox ? sandboxKey || process.env.STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY;
    if (!secret) {
        throw new Error(isSandbox ? "STRIPE_SANDBOX_SECRET_KEY is not set" : "STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](secret, {
        apiVersion: "2024-06-20"
    });
    return stripeClient;
}
}),
"[project]/404SquadSolarConnect/final/app/api/stripe/checkout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/services/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$stripe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/stripe.ts [app-route] (ecmascript)");
;
;
;
;
const dynamic = "force-dynamic";
const runtime = "nodejs";
async function POST(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await req.json();
        const invoiceId = body?.invoiceId;
        if (!invoiceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "invoiceId is required"
            }, {
                status: 400
            });
        }
        const invoice = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].invoice.findUnique({
            where: {
                id: invoiceId
            }
        });
        if (!invoice) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invoice not found"
            }, {
                status: 404
            });
        }
        if (user.role === "customer" && invoice.customerId !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            });
        }
        if (invoice.status === "paid") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invoice already paid"
            }, {
                status: 409
            });
        }
        if (invoice.amount <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invoice amount must be greater than 0"
            }, {
                status: 400
            });
        }
        const stripe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$stripe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStripe"])();
        const origin = req.headers.get("origin") || ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000";
        const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
        const unitAmount = Math.round(invoice.amount * 100);
        const maxAmount = 999999.99;
        if (invoice.amount > maxAmount) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Invoice amount exceeds Stripe limit of ${maxAmount.toLocaleString()} ${currency.toUpperCase()}.`
            }, {
                status: 400
            });
        }
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: [
                "card"
            ],
            currency,
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: invoice.description || "Solar invoice"
                        },
                        unit_amount: unitAmount
                    },
                    quantity: 1
                }
            ],
            metadata: {
                invoiceId: invoice.id,
                customerId: invoice.customerId
            },
            success_url: `${origin}/customer/invoices/${invoice.id}?success=1`,
            cancel_url: `${origin}/customer/invoices/${invoice.id}?canceled=1`
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: session.url
        });
    } catch (error) {
        console.error("[stripe] checkout failed", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to start payment. Check Stripe configuration."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7c77c374._.js.map