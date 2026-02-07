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
"[project]/404SquadSolarConnect/final/lib/pdf.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildReportPdf",
    ()=>buildReportPdf,
    "buildSimplePdf",
    ()=>buildSimplePdf,
    "writePdfToPublic",
    ()=>writePdfToPublic
]);
function escapePdfText(value) {
    return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function buildSimplePdf(title, lines) {
    const contentLines = [
        "BT",
        "/F1 18 Tf",
        "72 740 Td",
        `(${escapePdfText(title)}) Tj`,
        "/F1 12 Tf",
        "16 TL",
        ...lines.map((line)=>`T* (${escapePdfText(line)}) Tj`),
        "ET"
    ].join("\n");
    const objects = [];
    objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
    objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
    objects[3] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n";
    objects[4] = `4 0 obj\n<< /Length ${Buffer.byteLength(contentLines, "utf8")} >>\nstream\n${contentLines}\nendstream\nendobj\n`;
    objects[5] = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
    let pdf = "%PDF-1.4\n";
    const offsets = [
        0
    ];
    for(let i = 1; i <= 5; i += 1){
        offsets[i] = pdf.length;
        pdf += objects[i];
    }
    const xrefStart = pdf.length;
    pdf += "xref\n0 6\n0000000000 65535 f \n";
    for(let i = 1; i <= 5; i += 1){
        pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n";
    pdf += `${xrefStart}\n%%EOF\n`;
    return Buffer.from(pdf, "utf8");
}
function buildReportPdf({ title, subtitle, sections, footer }) {
    const content = [];
    // Header background
    content.push("0.93 0.97 0.99 rg");
    content.push("0 720 612 72 re f");
    // Title
    content.push("0 0 0 rg");
    content.push("BT");
    content.push("/F1 18 Tf");
    content.push("72 760 Td");
    content.push(`(${escapePdfText(title)}) Tj`);
    if (subtitle) {
        content.push("/F1 10 Tf");
        content.push("0 -18 Td");
        content.push(`(${escapePdfText(subtitle)}) Tj`);
    }
    content.push("ET");
    let y = 680;
    sections.forEach((section)=>{
        content.push("BT");
        content.push("/F1 12 Tf");
        content.push(`72 ${y} Td`);
        content.push(`(${escapePdfText(section.title)}) Tj`);
        content.push("ET");
        y -= 16;
        section.lines.forEach((line)=>{
            content.push("BT");
            content.push("/F1 10 Tf");
            content.push(`72 ${y} Td`);
            content.push(`(${escapePdfText(line.label)}) Tj`);
            content.push("ET");
            content.push("BT");
            content.push("/F1 10 Tf");
            content.push(`360 ${y} Td`);
            content.push(`(${escapePdfText(line.value)}) Tj`);
            content.push("ET");
            y -= 14;
        });
        y -= 10;
        content.push("0.85 0.85 0.85 RG");
        content.push(`72 ${y} m 540 ${y} l S`);
        y -= 14;
    });
    if (footer) {
        content.push("0 0 0 rg");
        content.push("BT");
        content.push("/F1 9 Tf");
        content.push(`72 ${y} Td`);
        content.push(`(${escapePdfText(footer)}) Tj`);
        content.push("ET");
    }
    const contentLines = content.join("\n");
    const objects = [];
    objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
    objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
    objects[3] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n";
    objects[4] = `4 0 obj\n<< /Length ${Buffer.byteLength(contentLines, "utf8")} >>\nstream\n${contentLines}\nendstream\nendobj\n`;
    objects[5] = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
    let pdf = "%PDF-1.4\n";
    const offsets = [
        0
    ];
    for(let i = 1; i <= 5; i += 1){
        offsets[i] = pdf.length;
        pdf += objects[i];
    }
    const xrefStart = pdf.length;
    pdf += "xref\n0 6\n0000000000 65535 f \n";
    for(let i = 1; i <= 5; i += 1){
        pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n";
    pdf += `${xrefStart}\n%%EOF\n`;
    return Buffer.from(pdf, "utf8");
}
async function writePdfToPublic({ filename, buffer }) {
    const { promises: fs } = await __turbopack_context__.A("[externals]/fs [external] (fs, cjs, async loader)");
    const path = await __turbopack_context__.A("[externals]/path [external] (path, cjs, async loader)");
    const dir = path.join(process.cwd(), "public", "pdfs");
    await fs.mkdir(dir, {
        recursive: true
    });
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buffer);
    return `/pdfs/${filename}`;
}
}),
"[project]/404SquadSolarConnect/final/lib/notifications.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendAgreementNotification",
    ()=>sendAgreementNotification,
    "sendApplicationDecisionNotification",
    ()=>sendApplicationDecisionNotification,
    "sendBidAcceptedNotification",
    ()=>sendBidAcceptedNotification,
    "sendInstallationPaymentCompletedNotification",
    ()=>sendInstallationPaymentCompletedNotification,
    "sendInstallationUpdate",
    ()=>sendInstallationUpdate,
    "sendInstallerVerificationNotification",
    ()=>sendInstallerVerificationNotification,
    "sendInvoicePaidNotification",
    ()=>sendInvoicePaidNotification,
    "sendPaymentApprovedNotification",
    ()=>sendPaymentApprovedNotification,
    "sendPaymentRejectedNotification",
    ()=>sendPaymentRejectedNotification,
    "sendPaymentReminder",
    ()=>sendPaymentReminder,
    "sendPreVisitApprovalNotification",
    ()=>sendPreVisitApprovalNotification,
    "sendSiteVisitPaymentCompletedNotification",
    ()=>sendSiteVisitPaymentCompletedNotification,
    "sendSiteVisitRescheduledNotification",
    ()=>sendSiteVisitRescheduledNotification,
    "sendSiteVisitScheduledNotification",
    ()=>sendSiteVisitScheduledNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
;
async function sendEmail({ to, subject, body }) {
    const smtpUser = process.env.GMAIL_USER;
    const smtpPass = process.env.GMAIL_APP_PASSWORD;
    if (!smtpUser || !smtpPass) {
        console.log("[notification] email", {
            to,
            subject,
            body
        });
        return;
    }
    const module = await __turbopack_context__.A("[project]/404SquadSolarConnect/final/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript, async loader)").catch(()=>null);
    if (!module) {
        console.log("[notification] email", {
            to,
            subject,
            body
        });
        return;
    }
    const nodemailer = module.default ?? module;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
    try {
        await transporter.sendMail({
            from: smtpUser,
            to,
            subject,
            text: body
        });
    } catch (error) {
        console.warn("[notification] email failed", error);
    }
}
async function createNotification(userId, title, body, link) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.create({
            data: {
                userId,
                title,
                body,
                link
            }
        });
    } catch (error) {
        console.warn("[notification] failed to persist notification", error);
    }
}
async function resolveEmail(userId) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id: userId
        }
    });
    return user?.email ?? `${userId}@example.com`;
}
async function sendPaymentApprovedNotification(payment) {
    const to = await resolveEmail(payment.customerId);
    await sendEmail({
        to,
        subject: `Payment ${payment.id} approved`,
        body: `Your payment for ${payment.type} has been approved. Reference: ${payment.reference ?? payment.id}.`
    });
    await createNotification(payment.customerId, "Payment approved", `Your payment ${payment.id} has been approved.`);
}
async function sendPaymentRejectedNotification(payment) {
    const to = await resolveEmail(payment.customerId);
    await sendEmail({
        to,
        subject: `Payment ${payment.id} rejected`,
        body: `Your payment could not be approved. Notes: ${payment.notes ?? "None provided."}`
    });
    await createNotification(payment.customerId, "Payment rejected", `Your payment ${payment.id} was rejected. ${payment.notes ?? ""}`.trim());
}
async function sendPaymentReminder(invoice) {
    const to = await resolveEmail(invoice.customerId);
    await sendEmail({
        to,
        subject: `Reminder: Invoice ${invoice.id} is pending`,
        body: `${invoice.description} is due on ${new Date(invoice.dueDate).toDateString()}. Amount: ${invoice.amount}.`
    });
    await createNotification(invoice.customerId, "Payment reminder", `${invoice.description} is due on ${new Date(invoice.dueDate).toDateString()}.`);
}
async function sendInstallationUpdate(customerId, message) {
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject: "Installation update",
        body: message
    });
    await createNotification(customerId, "Installation update", message);
}
async function sendAgreementNotification(userId, message, link) {
    const to = await resolveEmail(userId);
    await sendEmail({
        to,
        subject: "Agreement update",
        body: message
    });
    await createNotification(userId, "Agreement update", message, link);
}
async function sendSiteVisitScheduledNotification(customerId, visitDate, address) {
    const dateLabel = visitDate.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const body = address ? `A site visit has been scheduled for ${dateLabel} at ${address}.` : `A site visit has been scheduled for ${dateLabel}.`;
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject: "Site visit scheduled",
        body
    });
    await createNotification(customerId, "Site visit scheduled", body);
}
async function sendSiteVisitRescheduledNotification(customerId, visitDate, address) {
    const dateLabel = visitDate.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const body = address ? `A site visit has been rescheduled for ${dateLabel} at ${address}.` : `A site visit has been rescheduled for ${dateLabel}.`;
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject: "Reschedule site visit",
        body
    });
    await createNotification(customerId, "Reschedule site visit", body);
}
async function sendApplicationDecisionNotification(customerId, status, reason) {
    const subject = status === "approved" ? "Application approved" : "Application rejected";
    const body = status === "approved" ? "Your solar application has been approved. You may now proceed with package selection." : `Your solar application was rejected. ${reason ?? "Please contact support for details."}`;
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject,
        body
    });
    await createNotification(customerId, subject, body);
}
async function sendPreVisitApprovalNotification(customerId) {
    const subject = "Application approved - site visit payment required";
    const body = "Your application has been approved. Please pay the site visit fee so we can schedule your visit.";
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject,
        body
    });
    await createNotification(customerId, subject, body);
}
async function sendInstallerVerificationNotification(installerUserId, status, reason) {
    const subject = status === "verified" ? "Installer verification approved" : status === "suspended" ? "Installer account suspended" : "Installer verification rejected";
    const body = status === "verified" ? "Your installer organization has been verified." : status === "suspended" ? "Your installer organization has been suspended. Please contact support." : `Your installer organization was rejected.${reason ? ` Reason: ${reason}` : " Please contact support for details."}`;
    const to = await resolveEmail(installerUserId);
    await sendEmail({
        to,
        subject,
        body
    });
    await createNotification(installerUserId, subject, body);
}
async function sendBidAcceptedNotification(customerId, installerUserId, bidPrice) {
    const subject = "Bid accepted";
    const body = `A bid has been accepted for LKR ${bidPrice.toLocaleString()}. Please proceed with the installation payment.`;
    const installerEmail = await resolveEmail(installerUserId);
    await sendEmail({
        to: installerEmail,
        subject,
        body
    });
    await createNotification(installerUserId, subject, body);
    await createNotification(customerId, subject, body);
}
async function sendInvoicePaidNotification(customerId, invoiceId, amount) {
    const subject = "Payment received";
    const body = `Your payment for invoice ${invoiceId} (LKR ${amount.toLocaleString()}) was received.`;
    const to = await resolveEmail(customerId);
    await sendEmail({
        to,
        subject,
        body
    });
    await createNotification(customerId, subject, body);
}
async function sendSiteVisitPaymentCompletedNotification(applicationId, invoiceId, amount) {
    const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findUnique({
        where: {
            id: applicationId
        },
        include: {
            customer: true
        }
    });
    if (!application) return;
    const officers = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
        where: {
            role: "officer",
            status: "active"
        },
        select: {
            id: true
        }
    });
    if (officers.length === 0) return;
    const amountLabel = `LKR ${Number(amount).toLocaleString()}`;
    const visitDate = application.siteVisitDate ? ` Site visit date: ${application.siteVisitDate.toLocaleString()}.` : "";
    const address = application.customer?.address ? ` Address: ${application.customer.address}.` : "";
    const title = "Site visit payment completed";
    const body = `Application ${application.reference} for ${application.customer?.name ?? "customer"} paid the site visit fee (${amountLabel}). Invoice ${invoiceId}.${visitDate}${address}`.trim();
    await Promise.all(officers.map((officer)=>createNotification(officer.id, title, body, "/officer/applications")));
}
async function sendInstallationPaymentCompletedNotification(applicationId, invoiceId, amount) {
    const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findUnique({
        where: {
            id: applicationId
        },
        include: {
            customer: true,
            installerOrganization: {
                include: {
                    users: true
                }
            }
        }
    });
    if (!application?.installerOrganization) return;
    const installerUsers = application.installerOrganization.users.filter((user)=>user.role === "installer" && user.status === "active");
    if (installerUsers.length === 0) return;
    const amountLabel = `LKR ${Number(amount).toLocaleString()}`;
    const title = "Installation payment completed";
    const body = `Installation payment received for application ${application.reference} (${amountLabel}). Invoice ${invoiceId}. Customer: ${application.customer?.name ?? "N/A"}.`;
    await Promise.all(installerUsers.map((user)=>createNotification(user.id, title, body, "/installer/orders")));
}
}),
"[project]/404SquadSolarConnect/final/app/api/agreements/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/services/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$pdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/pdf.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/notifications.ts [app-route] (ecmascript)");
;
;
;
;
;
function buildCustomerAgreementLines({ customerName, installerName, senderName, dateLabel }) {
    return [
        `To: ${customerName}`,
        `From: ${senderName}`,
        `Date: ${dateLabel}`,
        "Subject: Solar Installation Agreement",
        "",
        `I acknowledge that I selected ${installerName ?? "the installer"} through the platform and agree to the terms`,
        "of the solar installation. I am responsible for providing accurate information and cooperating",
        "with the installer and officer during installation, inspection, and commissioning.",
        "",
        "Signature: ______________________________",
        "Name: _________________________________",
        "Date: _________________________________"
    ];
}
function buildInstallerAgreementLines({ installerName, customerName, senderName, dateLabel, packageName, panelCount, panelType, inverterBrand, warranty }) {
    const panelDetails = [
        packageName ? `Package: ${packageName}` : null,
        panelCount ? `Panel Count: ${panelCount}` : null,
        panelType ? `Panel Type: ${panelType}` : null,
        inverterBrand ? `Inverter Brand: ${inverterBrand}` : null,
        warranty ? `Warranty: ${warranty}` : null
    ].filter(Boolean);
    return [
        `To: ${installerName ?? "Installer"}`,
        `From: ${senderName}`,
        `Date: ${dateLabel}`,
        "Subject: Solar Installation Agreement",
        "",
        `I confirm the solar installation for ${customerName} and commit to providing the agreed`,
        "equipment, workmanship, and warranty coverage as described below.",
        ...panelDetails,
        "",
        "Signature: ______________________________",
        "Name: _________________________________",
        "Date: _________________________________"
    ];
}
async function GET(request) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const url = new URL(request.url);
    const applicationRef = url.searchParams.get("applicationId");
    if (!applicationRef) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Application ID is required"
        }, {
            status: 400
        });
    }
    const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findFirst({
        where: {
            reference: applicationRef
        },
        include: {
            customer: true,
            installerOrganization: true,
            selectedPackage: true
        }
    });
    if (!application) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Application not found"
        }, {
            status: 404
        });
    }
    if (user.role === "customer" && application.customerId !== user.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden"
        }, {
            status: 403
        });
    }
    if (user.role === "installer" && application.installerOrganizationId !== user.organization?.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden"
        }, {
            status: 403
        });
    }
    const agreement = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].agreement.findFirst({
        where: {
            applicationId: application.id
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        agreement
    });
}
async function POST(request) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$services$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentUser"])();
    if (!user || user.role !== "officer") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const body = await request.json().catch(()=>({}));
    const applicationRef = body.applicationId;
    if (!applicationRef) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Application ID is required"
        }, {
            status: 400
        });
    }
    const application = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.findFirst({
        where: {
            reference: applicationRef
        },
        include: {
            customer: true,
            installerOrganization: true,
            selectedPackage: true
        }
    });
    if (!application) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Application not found"
        }, {
            status: 404
        });
    }
    const senderName = user.name || "Officer";
    const dateLabel = new Date().toLocaleDateString();
    const customerPdf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$pdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSimplePdf"])("Solar Installation Agreement (Customer)", buildCustomerAgreementLines({
        customerName: application.customer.name,
        installerName: application.installerOrganization?.name ?? undefined,
        senderName,
        dateLabel
    }));
    const installerPdf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$pdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSimplePdf"])("Solar Installation Agreement (Installer)", buildInstallerAgreementLines({
        installerName: application.installerOrganization?.name ?? undefined,
        customerName: application.customer.name,
        senderName,
        dateLabel,
        packageName: application.selectedPackage?.name ?? null,
        panelCount: application.selectedPackage?.panelCount ?? null,
        panelType: application.selectedPackage?.panelType ?? null,
        inverterBrand: application.selectedPackage?.inverterBrand ?? null,
        warranty: application.selectedPackage?.warranty ?? null
    }));
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].agreement.findFirst({
        where: {
            applicationId: application.id
        }
    });
    const agreement = existing ? await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].agreement.update({
        where: {
            id: existing.id
        },
        data: {
            customerId: application.customerId,
            installerOrganizationId: application.installerOrganizationId ?? null
        }
    }) : await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].agreement.create({
        data: {
            applicationId: application.id,
            customerId: application.customerId,
            installerOrganizationId: application.installerOrganizationId ?? null
        }
    });
    const customerPdfUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$pdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writePdfToPublic"])({
        filename: `agreement-${agreement.id}-customer.pdf`,
        buffer: customerPdf
    });
    const installerPdfUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$pdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writePdfToPublic"])({
        filename: `agreement-${agreement.id}-installer.pdf`,
        buffer: installerPdf
    });
    const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].agreement.update({
        where: {
            id: agreement.id
        },
        data: {
            customerPdfUrl,
            installerPdfUrl,
            status: "draft",
            customerSignedUrl: null,
            installerSignedUrl: null,
            customerSignedAt: null,
            installerSignedAt: null,
            sentAt: null,
            officerApprovedAt: null
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].application.update({
        where: {
            id: application.id
        },
        data: {
            status: "inspection_approved"
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendAgreementNotification"])(application.customerId, "Your agreement has been prepared and will be sent for signature soon.");
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        agreement: updated
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ff3d254c._.js.map