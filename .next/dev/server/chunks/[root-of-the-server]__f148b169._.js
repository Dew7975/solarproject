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
"[project]/404SquadSolarConnect/final/app/api/bids/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/prisma.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
function errorJson(message, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status
    });
}
async function getIdFromCtx(ctx) {
    const params = await Promise.resolve(ctx.params);
    const direct = params["id"] ?? params["bidId"] ?? params["sessionId"];
    const value = direct ?? Object.values(params)[0];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
}
function mapSessionForUI(session) {
    const app = session.application;
    const tech = app?.technicalDetails ?? {};
    const acceptedBid = (session.bids ?? []).find((b)=>b.status === "accepted") ?? null;
    return {
        id: session.id,
        status: session.status,
        bidType: session.bidType ?? "open",
        requirements: session.requirements ?? null,
        maxBudget: session.maxBudget ?? null,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        selectedBidId: acceptedBid?.id ?? null,
        bids: (session.bids ?? []).map((b)=>({
                id: b.id,
                status: b.status,
                price: b.price,
                proposal: b.proposal,
                warranty: b.warranty,
                estimatedDays: b.estimatedDays,
                createdAt: b.createdAt,
                updatedAt: b.updatedAt,
                installerName: b.organization?.name ?? b.installer?.name ?? "Installer",
                installerRating: b.organization?.rating ?? 0,
                completedProjects: b.organization?.completedInstallations ?? 0,
                packageId: b.packageId ?? null,
                packageName: b.package?.name ?? null,
                contact: {
                    phone: b.organization?.phone ?? null,
                    email: b.installer?.email ?? null
                }
            })),
        applicationDetails: {
            address: tech.siteAddress || tech.address || app?.address || null,
            capacity: tech.desiredCapacity != null ? `${tech.desiredCapacity} kW` : null,
            customerPhone: app?.customer?.phone ?? null,
            customerEmail: app?.customer?.email ?? null
        }
    };
}
async function GET(_req, ctx) {
    try {
        const id = await getIdFromCtx(ctx);
        if (!id) return errorJson("Bid session id is required", 400);
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].bidSession.findUnique({
            where: {
                id
            },
            include: {
                application: {
                    include: {
                        customer: true
                    }
                },
                bids: {
                    include: {
                        installer: true,
                        organization: true,
                        package: true
                    },
                    orderBy: {
                        updatedAt: "desc"
                    }
                }
            }
        });
        if (!session) return errorJson("Bid session not found", 404);
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mapSessionForUI(session), {
            status: 200
        });
    } catch (e) {
        console.error("GET /api/bids/[id] error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e instanceof Error ? e.message : "Failed"
        }, {
            status: 500
        });
    }
}
async function PATCH(req, ctx) {
    try {
        const id = await getIdFromCtx(ctx);
        if (!id) return errorJson("Bid session id is required", 400);
        const body = await req.json().catch(()=>({}));
        const action = body?.action;
        const bidId = body?.bidId;
        if (!action || !bidId) return errorJson("action and bidId are required", 400);
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].bidSession.findUnique({
            where: {
                id
            },
            include: {
                bids: true,
                application: true
            }
        });
        if (!session) return errorJson("Bid session not found", 404);
        if (session.status !== "open") return errorJson("Bid session is not open", 400);
        const target = session.bids.find((b)=>b.id === bidId);
        if (!target) return errorJson("Bid not found in this session", 404);
        const invoiceResult = await __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
            if (action === "reject") {
                await tx.bid.update({
                    where: {
                        id: bidId
                    },
                    data: {
                        status: "rejected"
                    }
                });
                return {
                    invoiceId: null
                };
            }
            // ACCEPT
            await tx.bid.update({
                where: {
                    id: bidId
                },
                data: {
                    status: "accepted"
                }
            });
            // Reject other pending bids
            const others = session.bids.filter((b)=>b.id !== bidId && b.status === "pending");
            for (const b of others){
                await tx.bid.update({
                    where: {
                        id: b.id
                    },
                    data: {
                        status: "rejected"
                    }
                });
            }
            // Close session and remember selected package (field exists in schema)
            await tx.bidSession.update({
                where: {
                    id
                },
                data: {
                    status: "closed",
                    selectedPackageId: target.packageId ?? null
                }
            });
            // Create invoice for installation payment
            const invoice = await tx.invoice.create({
                data: {
                    applicationId: session.applicationId,
                    customerId: session.customerId,
                    amount: target.price,
                    description: `Installation payment for application ${session.applicationId}`,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    status: "pending",
                    type: "installation"
                }
            });
            // Move application to payment_pending; DO NOT assign installer yet
            await tx.application.update({
                where: {
                    id: session.applicationId
                },
                data: {
                    status: "payment_pending",
                    selectedPackageId: target.packageId ?? null,
                    installerOrganizationId: null
                }
            });
            return {
                invoiceId: invoice.id
            };
        });
        // Return invoiceId so customer UI can redirect to payment
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            invoiceId: invoiceResult.invoiceId
        }, {
            status: 200
        });
    } catch (e) {
        console.error("PATCH /api/bids/[id] error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e instanceof Error ? e.message : "Failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f148b169._.js.map