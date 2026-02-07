module.exports = [
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/404SquadSolarConnect/final/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/404SquadSolarConnect/final/lib/auth-server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/jose/dist/node/esm/jwt/sign.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/jose/dist/node/esm/jwt/verify.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/bcryptjs/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-rsc] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
async function createAuthSession(userId, role) {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].session.create({
        data: {
            token,
            userId,
            expiresAt
        }
    });
    const jwt = await new __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SignJWT"]({
        token,
        role
    }).setProtectedHeader({
        alg: "HS256"
    }).setExpirationTime(expiresAt).sign(getSecret());
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
            where: {
                token
            }
        });
    }
    cookieStore.delete(SESSION_COOKIE);
}
async function getSessionUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const jwt = cookieStore.get(SESSION_COOKIE)?.value;
    if (!jwt) return null;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(jwt, getSecret());
        const token = payload.token;
        if (!token) return null;
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].session.deleteMany({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden"
        }, {
            status: 403
        });
    }
    return null;
}
}),
"[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"606b73709b0fa3699ff285b8aaeae10729fa2e7bb5":"loginAction","60c5820d3780857758fceefd5634f1a24b35dbc966":"registerAction"},"",""] */ __turbopack_context__.s([
    "loginAction",
    ()=>loginAction,
    "registerAction",
    ()=>registerAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/auth-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
function getString(fd, key) {
    const v = fd.get(key);
    return typeof v === "string" ? v.trim() : "";
}
async function loginAction(_, formData) {
    const email = getString(formData, "email").toLowerCase();
    const password = getString(formData, "password");
    const redirectTo = getString(formData, "redirect") || "/customer/dashboard";
    if (!email || !password) {
        return {
            error: "Email and password are required"
        };
    }
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            email
        }
    });
    if (!user) return {
        error: "Invalid credentials"
    };
    if (user.status === "suspended") {
        return {
            error: "Account is suspended. Please contact support."
        };
    }
    const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.passwordHash);
    if (!ok) return {
        error: "Invalid credentials"
    };
    // ✅ uses your existing session/cookie helper
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthSession"])(user.id, user.role);
    const roleRedirect = user.role === "officer" ? "/officer/dashboard" : user.role === "installer" ? "/installer/dashboard" : "/customer/dashboard";
    // If redirect is default/home, go by role
    const finalRedirect = redirectTo === "/" || redirectTo === "/customer/dashboard" ? roleRedirect : redirectTo;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(finalRedirect);
}
async function registerAction(_, formData) {
    const name = getString(formData, "name");
    const email = getString(formData, "email").toLowerCase();
    const password = getString(formData, "password");
    const confirmPassword = getString(formData, "confirmPassword");
    const roleRaw = getString(formData, "role") || "customer";
    const phone = getString(formData, "phone") || undefined;
    const address = getString(formData, "address") || undefined;
    if (!name || !email || !password) {
        return {
            error: "Missing required fields"
        };
    }
    if (password !== confirmPassword) {
        return {
            error: "Passwords do not match"
        };
    }
    if (!Object.values(__TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"]).includes(roleRaw)) {
        return {
            error: "Invalid role"
        };
    }
    const role = roleRaw;
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            email
        }
    });
    if (existing) return {
        error: "Email already registered"
    };
    const passwordHash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hashPassword"])(password);
    let organizationId;
    if (role === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"].installer) {
        const companyName = getString(formData, "companyName");
        const description = getString(formData, "description") || undefined;
        const org = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].organization.create({
            data: {
                name: companyName || name,
                description,
                phone,
                address,
                verified: false
            }
        });
        organizationId = org.id;
    }
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
            status: "active",
            phone,
            address,
            organizationId,
            verified: role !== __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"].installer
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthSession"])(user.id, user.role);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(role === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"].installer ? "/installer/dashboard" : role === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["UserRole"].officer ? "/officer/dashboard" : "/customer/dashboard");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    registerAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "606b73709b0fa3699ff285b8aaeae10729fa2e7bb5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerAction, "60c5820d3780857758fceefd5634f1a24b35dbc966", null);
}),
"[project]/404SquadSolarConnect/final/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)");
;
}),
"[project]/404SquadSolarConnect/final/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "606b73709b0fa3699ff285b8aaeae10729fa2e7bb5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/404SquadSolarConnect/final/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/app/actions/auth.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__60011817._.js.map