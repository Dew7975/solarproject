module.exports = [
"[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* ------------------------------------------------------------------ */ /* Core domain types                                                    */ /* ------------------------------------------------------------------ */ __turbopack_context__.s([
    "cn",
    ()=>cn,
    "fetchApplication",
    ()=>fetchApplication,
    "fetchApplications",
    ()=>fetchApplications,
    "fetchBidSessions",
    ()=>fetchBidSessions,
    "fetchCurrentUser",
    ()=>fetchCurrentUser,
    "fetchInstallers",
    ()=>fetchInstallers,
    "fetchPayments",
    ()=>fetchPayments,
    "fetchUsers",
    ()=>fetchUsers,
    "formatCapacityForFiltering",
    ()=>formatCapacityForFiltering,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCapacityForFiltering(capacity) {
    if (!capacity) return "";
    const text = capacity.toLowerCase().trim();
    // Extract first number like "3", "3.5", etc.
    const match = text.match(/(\d+(\.\d+)?)/);
    if (!match) return text;
    let value = Number.parseFloat(match[1]);
    if (Number.isNaN(value)) return text;
    // If it's in watts (e.g., "5000w"), convert to kW
    const isKw = text.includes("kw");
    const isW = text.includes("w");
    if (isW && !isKw) value = value / 1000;
    // Normalize (remove trailing zeros)
    return String(Number(value.toFixed(2)));
}
/* ------------------------------------------------------------------ */ /* API helpers                                                          */ /* ------------------------------------------------------------------ */ async function handleResponse(response) {
    if (!response.ok) {
        const data = await response.json().catch(()=>({}));
        const message = data?.error || response.statusText;
        throw new Error(message || "Request failed");
    }
    return response.json();
}
async function fetchCurrentUser() {
    const response = await fetch("/api/auth/me", {
        cache: "no-store"
    });
    if (response.status === 401) return null;
    const data = await handleResponse(response);
    return data.user;
}
async function login(payload) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await handleResponse(response);
    return data.user;
}
async function register(payload) {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await handleResponse(response);
    return data.user;
}
async function logout() {
    await fetch("/api/auth/logout", {
        method: "POST"
    });
}
async function fetchApplications() {
    const response = await fetch("/api/applications", {
        cache: "no-store"
    });
    const data = await handleResponse(response);
    return data.applications;
}
async function fetchApplication(reference) {
    const response = await fetch(`/api/applications/${reference}`, {
        cache: "no-store"
    });
    if (response.status === 404) return null;
    const data = await handleResponse(response);
    return data.application;
}
async function fetchInstallers(verifiedOnly = true) {
    const url = verifiedOnly ? "/api/installers?verified=true" : "/api/installers";
    const response = await fetch(url, {
        cache: "no-store"
    });
    const data = await handleResponse(response);
    return data.installers;
}
async function fetchBidSessions() {
    const response = await fetch("/api/bids", {
        cache: "no-store"
    });
    const data = await handleResponse(response);
    return data.bidSessions;
}
async function fetchPayments() {
    const response = await fetch("/api/payments", {
        cache: "no-store"
    });
    return handleResponse(response);
}
async function fetchUsers() {
    const response = await fetch("/api/users", {
        cache: "no-store"
    });
    const data = await handleResponse(response);
    return data.users;
}
}),
"[project]/404SquadSolarConnect/final/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/404SquadSolarConnect/final/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/404SquadSolarConnect/final/components/ui/label.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/@radix-ui/react-label/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/404SquadSolarConnect/final/components/ui/tabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Tabs({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "tabs",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/tabs.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
function TabsList({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["List"], {
        "data-slot": "tabs-list",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/tabs.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function TabsTrigger({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "tabs-trigger",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/tabs.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
function TabsContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
        "data-slot": "tabs-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex-1 outline-none', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/tabs.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/404SquadSolarConnect/final/components/ui/textarea.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/404SquadSolarConnect/final/app/actions/data:56532e [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60c5820d3780857758fceefd5634f1a24b35dbc966":"registerAction"},"404SquadSolarConnect/final/app/actions/auth.ts",""] */ __turbopack_context__.s([
    "registerAction",
    ()=>registerAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var registerAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60c5820d3780857758fceefd5634f1a24b35dbc966", __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "registerAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgcmVkaXJlY3QgfSBmcm9tIFwibmV4dC9uYXZpZ2F0aW9uXCJcclxuaW1wb3J0IHsgVXNlclJvbGUgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIlxyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvcHJpc21hXCJcclxuaW1wb3J0IHsgY3JlYXRlQXV0aFNlc3Npb24sIGhhc2hQYXNzd29yZCwgdmVyaWZ5UGFzc3dvcmQgfSBmcm9tIFwiQC9saWIvYXV0aC1zZXJ2ZXJcIlxyXG5cclxuZnVuY3Rpb24gZ2V0U3RyaW5nKGZkOiBGb3JtRGF0YSwga2V5OiBzdHJpbmcpIHtcclxuICBjb25zdCB2ID0gZmQuZ2V0KGtleSlcclxuICByZXR1cm4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2LnRyaW0oKSA6IFwiXCJcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luQWN0aW9uKF86IHVua25vd24sIGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IGVtYWlsID0gZ2V0U3RyaW5nKGZvcm1EYXRhLCBcImVtYWlsXCIpLnRvTG93ZXJDYXNlKClcclxuICBjb25zdCBwYXNzd29yZCA9IGdldFN0cmluZyhmb3JtRGF0YSwgXCJwYXNzd29yZFwiKVxyXG4gIGNvbnN0IHJlZGlyZWN0VG8gPSBnZXRTdHJpbmcoZm9ybURhdGEsIFwicmVkaXJlY3RcIikgfHwgXCIvY3VzdG9tZXIvZGFzaGJvYXJkXCJcclxuXHJcbiAgaWYgKCFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcclxuICAgIHJldHVybiB7IGVycm9yOiBcIkVtYWlsIGFuZCBwYXNzd29yZCBhcmUgcmVxdWlyZWRcIiB9XHJcbiAgfVxyXG5cclxuICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsIH0gfSlcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IGVycm9yOiBcIkludmFsaWQgY3JlZGVudGlhbHNcIiB9XHJcblxyXG4gIGlmICh1c2VyLnN0YXR1cyA9PT0gXCJzdXNwZW5kZWRcIikge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IFwiQWNjb3VudCBpcyBzdXNwZW5kZWQuIFBsZWFzZSBjb250YWN0IHN1cHBvcnQuXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgb2sgPSBhd2FpdCB2ZXJpZnlQYXNzd29yZChwYXNzd29yZCwgdXNlci5wYXNzd29yZEhhc2gpXHJcbiAgaWYgKCFvaykgcmV0dXJuIHsgZXJyb3I6IFwiSW52YWxpZCBjcmVkZW50aWFsc1wiIH1cclxuXHJcbiAgLy8g4pyFIHVzZXMgeW91ciBleGlzdGluZyBzZXNzaW9uL2Nvb2tpZSBoZWxwZXJcclxuICBhd2FpdCBjcmVhdGVBdXRoU2Vzc2lvbih1c2VyLmlkLCB1c2VyLnJvbGUpXHJcblxyXG4gIGNvbnN0IHJvbGVSZWRpcmVjdCA9XHJcbiAgICB1c2VyLnJvbGUgPT09IFwib2ZmaWNlclwiXHJcbiAgICAgID8gXCIvb2ZmaWNlci9kYXNoYm9hcmRcIlxyXG4gICAgICA6IHVzZXIucm9sZSA9PT0gXCJpbnN0YWxsZXJcIlxyXG4gICAgICA/IFwiL2luc3RhbGxlci9kYXNoYm9hcmRcIlxyXG4gICAgICA6IFwiL2N1c3RvbWVyL2Rhc2hib2FyZFwiXHJcblxyXG4gIC8vIElmIHJlZGlyZWN0IGlzIGRlZmF1bHQvaG9tZSwgZ28gYnkgcm9sZVxyXG4gIGNvbnN0IGZpbmFsUmVkaXJlY3QgPVxyXG4gICAgcmVkaXJlY3RUbyA9PT0gXCIvXCIgfHwgcmVkaXJlY3RUbyA9PT0gXCIvY3VzdG9tZXIvZGFzaGJvYXJkXCJcclxuICAgICAgPyByb2xlUmVkaXJlY3RcclxuICAgICAgOiByZWRpcmVjdFRvXHJcblxyXG4gIHJlZGlyZWN0KGZpbmFsUmVkaXJlY3QpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWdpc3RlckFjdGlvbihfOiB1bmtub3duLCBmb3JtRGF0YTogRm9ybURhdGEpIHtcclxuICBjb25zdCBuYW1lID0gZ2V0U3RyaW5nKGZvcm1EYXRhLCBcIm5hbWVcIilcclxuICBjb25zdCBlbWFpbCA9IGdldFN0cmluZyhmb3JtRGF0YSwgXCJlbWFpbFwiKS50b0xvd2VyQ2FzZSgpXHJcbiAgY29uc3QgcGFzc3dvcmQgPSBnZXRTdHJpbmcoZm9ybURhdGEsIFwicGFzc3dvcmRcIilcclxuICBjb25zdCBjb25maXJtUGFzc3dvcmQgPSBnZXRTdHJpbmcoZm9ybURhdGEsIFwiY29uZmlybVBhc3N3b3JkXCIpXHJcblxyXG4gIGNvbnN0IHJvbGVSYXcgPSBnZXRTdHJpbmcoZm9ybURhdGEsIFwicm9sZVwiKSB8fCBcImN1c3RvbWVyXCJcclxuICBjb25zdCBwaG9uZSA9IGdldFN0cmluZyhmb3JtRGF0YSwgXCJwaG9uZVwiKSB8fCB1bmRlZmluZWRcclxuICBjb25zdCBhZGRyZXNzID0gZ2V0U3RyaW5nKGZvcm1EYXRhLCBcImFkZHJlc3NcIikgfHwgdW5kZWZpbmVkXHJcblxyXG4gIGlmICghbmFtZSB8fCAhZW1haWwgfHwgIXBhc3N3b3JkKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogXCJNaXNzaW5nIHJlcXVpcmVkIGZpZWxkc1wiIH1cclxuICB9XHJcblxyXG4gIGlmIChwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkKSB7XHJcbiAgICByZXR1cm4geyBlcnJvcjogXCJQYXNzd29yZHMgZG8gbm90IG1hdGNoXCIgfVxyXG4gIH1cclxuXHJcbiAgaWYgKCFPYmplY3QudmFsdWVzKFVzZXJSb2xlKS5pbmNsdWRlcyhyb2xlUmF3IGFzIFVzZXJSb2xlKSkge1xyXG4gICAgcmV0dXJuIHsgZXJyb3I6IFwiSW52YWxpZCByb2xlXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgcm9sZSA9IHJvbGVSYXcgYXMgVXNlclJvbGVcclxuXHJcbiAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHsgd2hlcmU6IHsgZW1haWwgfSB9KVxyXG4gIGlmIChleGlzdGluZykgcmV0dXJuIHsgZXJyb3I6IFwiRW1haWwgYWxyZWFkeSByZWdpc3RlcmVkXCIgfVxyXG5cclxuICBjb25zdCBwYXNzd29yZEhhc2ggPSBhd2FpdCBoYXNoUGFzc3dvcmQocGFzc3dvcmQpXHJcblxyXG4gIGxldCBvcmdhbml6YXRpb25JZDogc3RyaW5nIHwgdW5kZWZpbmVkXHJcblxyXG4gIGlmIChyb2xlID09PSBVc2VyUm9sZS5pbnN0YWxsZXIpIHtcclxuICAgIGNvbnN0IGNvbXBhbnlOYW1lID0gZ2V0U3RyaW5nKGZvcm1EYXRhLCBcImNvbXBhbnlOYW1lXCIpXHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGdldFN0cmluZyhmb3JtRGF0YSwgXCJkZXNjcmlwdGlvblwiKSB8fCB1bmRlZmluZWRcclxuXHJcbiAgICBjb25zdCBvcmcgPSBhd2FpdCBwcmlzbWEub3JnYW5pemF0aW9uLmNyZWF0ZSh7XHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBuYW1lOiBjb21wYW55TmFtZSB8fCBuYW1lLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHBob25lLFxyXG4gICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuXHJcbiAgICBvcmdhbml6YXRpb25JZCA9IG9yZy5pZFxyXG4gIH1cclxuXHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmNyZWF0ZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBwYXNzd29yZEhhc2gsXHJcbiAgICAgIHJvbGUsXHJcbiAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcclxuICAgICAgcGhvbmUsXHJcbiAgICAgIGFkZHJlc3MsXHJcbiAgICAgIG9yZ2FuaXphdGlvbklkLFxyXG4gICAgICB2ZXJpZmllZDogcm9sZSAhPT0gVXNlclJvbGUuaW5zdGFsbGVyLFxyXG4gICAgfSxcclxuICB9KVxyXG5cclxuICBhd2FpdCBjcmVhdGVBdXRoU2Vzc2lvbih1c2VyLmlkLCB1c2VyLnJvbGUpXHJcblxyXG4gIHJlZGlyZWN0KFxyXG4gICAgcm9sZSA9PT0gVXNlclJvbGUuaW5zdGFsbGVyXHJcbiAgICAgID8gXCIvaW5zdGFsbGVyL2Rhc2hib2FyZFwiXHJcbiAgICAgIDogcm9sZSA9PT0gVXNlclJvbGUub2ZmaWNlclxyXG4gICAgICA/IFwiL29mZmljZXIvZGFzaGJvYXJkXCJcclxuICAgICAgOiBcIi9jdXN0b21lci9kYXNoYm9hcmRcIixcclxuICApXHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InNUQWtEc0IifQ==
}),
"[project]/404SquadSolarConnect/final/app/register/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-ssr] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/building.js [app-ssr] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/components/ui/tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$data$3a$56532e__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/app/actions/data:56532e [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/404SquadSolarConnect/final/context/LanguageContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
// --- Floating Particles (Subtle) ---
function FloatingParticles() {
    const [particles, setParticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setParticles(Array.from({
            length: 20
        }));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 overflow-hidden pointer-events-none z-10",
        children: particles.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute rounded-full bg-white opacity-10",
                initial: {
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 0.5 + 0.5
                },
                animate: {
                    y: [
                        null,
                        Math.random() * -100 - 20 + "%"
                    ],
                    opacity: [
                        0.05,
                        0.2,
                        0.05
                    ]
                },
                transition: {
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5
                },
                style: {
                    width: Math.random() * 6 + 2 + "px",
                    height: Math.random() * 6 + 2 + "px"
                }
            }, i, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
function BenefitItem({ text }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: -10
        },
        animate: {
            opacity: 1,
            x: 0
        },
        className: "flex items-center gap-3 text-white/90",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-4 h-4 text-white"
                }, void 0, false, {
                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium tracking-wide",
                children: text
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
function RegisterForm() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const defaultRole = searchParams.get("role") || "customer";
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultRole);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const isCustomer = activeTab === "customer";
    // --- Professional Theme Colors (Deep & Rich) ---
    const themeColors = isCustomer ? {
        // Form Side
        inputClass: "focus-visible:ring-teal-600 focus-visible:border-teal-600 hover:border-teal-400 bg-white border-slate-200 focus:bg-white",
        buttonClass: "bg-teal-700 hover:bg-teal-800 shadow-teal-900/20",
        tabActive: "data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:border-teal-200",
        linkText: "text-teal-700",
        iconBg: "from-teal-600 to-emerald-800"
    } : {
        // Form Side
        inputClass: "focus-visible:ring-amber-600 focus-visible:border-amber-600 hover:border-amber-400 bg-white border-slate-200 focus:bg-white",
        buttonClass: "bg-amber-600 hover:bg-amber-700 shadow-amber-900/20",
        tabActive: "data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200",
        linkText: "text-amber-700",
        iconBg: "from-amber-500 to-orange-700"
    };
    const [customerData, setCustomerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
    });
    const [installerData, setInstallerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        password: "",
        confirmPassword: "",
        brDocument: null,
        businessLicense: null,
        insuranceCertificate: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setActiveTab(defaultRole);
    }, [
        defaultRole
    ]);
    const handleCustomerSubmit = (e)=>{
        e.preventDefault();
        setError("");
        startTransition(async ()=>{
            const formData = new FormData();
            formData.append("role", "customer");
            formData.append("name", customerData.name);
            formData.append("email", customerData.email);
            formData.append("phone", customerData.phone);
            formData.append("address", customerData.address);
            formData.append("password", customerData.password);
            formData.append("confirmPassword", customerData.confirmPassword);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$data$3a$56532e__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["registerAction"])(null, formData);
            if (result?.error) setError(result.error);
        });
    };
    const handleInstallerSubmit = (e)=>{
        e.preventDefault();
        setError("");
        startTransition(async ()=>{
            const formData = new FormData();
            formData.append("role", "installer");
            formData.append("name", installerData.companyName);
            formData.append("companyName", installerData.companyName);
            formData.append("description", installerData.description);
            formData.append("email", installerData.email);
            formData.append("phone", installerData.phone);
            formData.append("address", installerData.address);
            formData.append("password", installerData.password);
            formData.append("confirmPassword", installerData.confirmPassword);
            if (installerData.brDocument) formData.append("brDocument", installerData.brDocument);
            if (installerData.businessLicense) formData.append("businessLicense", installerData.businessLicense);
            if (installerData.insuranceCertificate) formData.append("insuranceCertificate", installerData.insuranceCertificate);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$app$2f$actions$2f$data$3a$56532e__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["registerAction"])(null, formData);
            if (result?.error) setError(result.error);
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen w-full bg-slate-50/50 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col relative bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 max-w-2xl mx-auto w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2 mb-10 group w-fit",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-10 h-10 rounded-xl bg-gradient-to-br transition-all duration-500 flex items-center justify-center shadow-lg group-hover:scale-105 ${themeColors.iconBg}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                        className: "w-6 h-6 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold tracking-tight text-slate-800",
                                    children: "CEB Solar"
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold tracking-tight text-slate-900",
                                    children: t("createAccount")
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-500 text-lg",
                                    children: t("registerSubtitle")
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tabs"], {
                            value: activeTab,
                            onValueChange: setActiveTab,
                            className: "w-full space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsList"], {
                                    className: "grid w-full grid-cols-2 p-1.5 h-14 bg-slate-100 rounded-2xl border border-slate-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "customer",
                                            className: `rounded-xl gap-2 text-sm font-semibold transition-all border border-transparent ${isCustomer ? themeColors.tabActive : "text-slate-500 hover:text-slate-700"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this),
                                                " ",
                                                t("customer")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "installer",
                                            className: `rounded-xl gap-2 text-sm font-semibold transition-all border border-transparent ${!isCustomer ? themeColors.tabActive : "text-slate-500 hover:text-slate-700"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 17
                                                }, this),
                                                " ",
                                                t("installer")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    mode: "wait",
                                    children: error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            height: 0
                                        },
                                        animate: {
                                            opacity: 1,
                                            height: "auto"
                                        },
                                        className: "p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    mode: "wait",
                                    children: isCustomer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].form, {
                                        initial: {
                                            opacity: 0,
                                            x: -20
                                        },
                                        animate: {
                                            opacity: 1,
                                            x: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            x: 20
                                        },
                                        onSubmit: handleCustomerSubmit,
                                        className: "space-y-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("fullName"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                    value: customerData.name,
                                                    onChange: (e)=>setCustomerData({
                                                            ...customerData,
                                                            name: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 48
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 181,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("email"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                    type: "email",
                                                    value: customerData.email,
                                                    onChange: (e)=>setCustomerData({
                                                            ...customerData,
                                                            email: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("phone"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                    value: customerData.phone,
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]{10}",
                                                    maxLength: 10,
                                                    onChange: (e)=>{
                                                        const next = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                        setCustomerData({
                                                            ...customerData,
                                                            phone: next
                                                        });
                                                    },
                                                    onInvalid: (e)=>{
                                                        e.currentTarget.setCustomValidity("Please enter a valid 10-digit phone number.");
                                                    },
                                                    onInput: (e)=>e.currentTarget.setCustomValidity(""),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 183,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("address"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledTextarea, {
                                                    value: customerData.address,
                                                    onChange: (e)=>setCustomerData({
                                                            ...customerData,
                                                            address: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 47
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PasswordField, {
                                                        label: t("password"),
                                                        value: customerData.password,
                                                        onChange: (v)=>setCustomerData({
                                                                ...customerData,
                                                                password: v
                                                            }),
                                                        show: showPassword,
                                                        toggle: ()=>setShowPassword(!showPassword),
                                                        inputClass: themeColors.inputClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                className: "font-semibold text-slate-700",
                                                                children: t("confirmPassword")
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 205,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                                type: "password",
                                                                value: customerData.confirmPassword,
                                                                onChange: (e)=>setCustomerData({
                                                                        ...customerData,
                                                                        confirmPassword: e.target.value
                                                                    }),
                                                                className: themeColors.inputClass
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                className: `w-full h-12 text-white font-semibold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] ${themeColors.buttonClass}`,
                                                disabled: loading,
                                                children: loading ? t("creatingAccount") : t("createCustomerAccount")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, "customer", true, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].form, {
                                        initial: {
                                            opacity: 0,
                                            x: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            x: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            x: -20
                                        },
                                        onSubmit: handleInstallerSubmit,
                                        className: "space-y-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("companyName"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                    value: installerData.companyName,
                                                    onChange: (e)=>setInstallerData({
                                                            ...installerData,
                                                            companyName: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 51
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                        label: t("email"),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                            type: "email",
                                                            value: installerData.email,
                                                            onChange: (e)=>setInstallerData({
                                                                    ...installerData,
                                                                    email: e.target.value
                                                                }),
                                                            className: themeColors.inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 48
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                        label: t("phone"),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                            value: installerData.phone,
                                                            inputMode: "numeric",
                                                            pattern: "[0-9]{10}",
                                                            maxLength: 10,
                                                            onChange: (e)=>{
                                                                const next = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                setInstallerData({
                                                                    ...installerData,
                                                                    phone: next
                                                                });
                                                            },
                                                            onInvalid: (e)=>{
                                                                e.currentTarget.setCustomValidity("Please enter a valid 10-digit phone number.");
                                                            },
                                                            onInput: (e)=>e.currentTarget.setCustomValidity(""),
                                                            className: themeColors.inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                            lineNumber: 225,
                                                            columnNumber: 24
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 22
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("address"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledTextarea, {
                                                    value: installerData.address,
                                                    onChange: (e)=>setInstallerData({
                                                            ...installerData,
                                                            address: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 47
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: t("description"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledTextarea, {
                                                    value: installerData.description,
                                                    onChange: (e)=>setInstallerData({
                                                            ...installerData,
                                                            description: e.target.value
                                                        }),
                                                    className: themeColors.inputClass
                                                }, void 0, false, {
                                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 51
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-slate-700 uppercase tracking-wide",
                                                        children: "Required Documents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledFileInput, {
                                                                label: t("brDocument"),
                                                                required: true,
                                                                onChange: (e)=>setInstallerData({
                                                                        ...installerData,
                                                                        brDocument: e.target.files?.[0] || null
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 248,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledFileInput, {
                                                                label: t("businessLicense"),
                                                                required: true,
                                                                onChange: (e)=>setInstallerData({
                                                                        ...installerData,
                                                                        businessLicense: e.target.files?.[0] || null
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledFileInput, {
                                                                label: t("insuranceCertificate"),
                                                                required: true,
                                                                onChange: (e)=>setInstallerData({
                                                                        ...installerData,
                                                                        insuranceCertificate: e.target.files?.[0] || null
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 22
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PasswordField, {
                                                        label: t("password"),
                                                        value: installerData.password,
                                                        onChange: (v)=>setInstallerData({
                                                                ...installerData,
                                                                password: v
                                                            }),
                                                        show: showPassword,
                                                        toggle: ()=>setShowPassword(!showPassword),
                                                        inputClass: themeColors.inputClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                className: "font-semibold text-slate-700",
                                                                children: t("confirmPassword")
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                                                                type: "password",
                                                                value: installerData.confirmPassword,
                                                                onChange: (e)=>setInstallerData({
                                                                        ...installerData,
                                                                        confirmPassword: e.target.value
                                                                    }),
                                                                className: themeColors.inputClass
                                                            }, void 0, false, {
                                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                                lineNumber: 270,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                        className: "w-5 h-5 shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: t("installerReviewNotice")
                                                    }, void 0, false, {
                                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 22
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 274,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                className: `w-full h-12 text-white font-semibold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] ${themeColors.buttonClass}`,
                                                disabled: loading,
                                                children: loading ? t("creatingAccount") : t("createInstallerAccount")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 279,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, "installer", true, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-sm pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-500",
                                            children: [
                                                t("alreadyHaveAccount"),
                                                " "
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 287,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/login",
                                            className: `font-bold hover:underline transition-colors ${themeColors.linkText}`,
                                            children: t("signIn")
                                        }, void 0, false, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 text-white shadow-2xl z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute inset-0 bg-gradient-to-br from-teal-700 to-emerald-900",
                        animate: {
                            opacity: isCustomer ? 1 : 0
                        },
                        transition: {
                            duration: 0.6
                        }
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-800",
                        animate: {
                            opacity: isCustomer ? 0 : 1
                        },
                        transition: {
                            duration: 0.6
                        }
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            opacity: [
                                0.3,
                                0.6,
                                0.3
                            ]
                        },
                        transition: {
                            duration: 5,
                            repeat: Infinity
                        },
                        className: "absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingParticles, {}, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 max-w-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: isCustomer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -20
                                },
                                transition: {
                                    duration: 0.4
                                },
                                className: "space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                            className: "w-10 h-10 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 335,
                                            columnNumber: 24
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 334,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-5xl font-bold leading-tight tracking-tight drop-shadow-md",
                                        children: t("reg_promo_customer_title")
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 337,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-emerald-50 text-xl leading-relaxed font-medium",
                                        children: t("reg_promo_customer_desc")
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 338,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-5 pt-6 border-t border-white/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_tracking")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 24
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_connect")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 343,
                                                columnNumber: 24
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_savings")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 344,
                                                columnNumber: 24
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, "customer-panel", true, {
                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                lineNumber: 326,
                                columnNumber: 18
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -20
                                },
                                transition: {
                                    duration: 0.4
                                },
                                className: "space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                            className: "w-10 h-10 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                            lineNumber: 357,
                                            columnNumber: 24
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-5xl font-bold leading-tight tracking-tight drop-shadow-md",
                                        children: t("reg_promo_installer_title")
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 359,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-orange-50 text-xl leading-relaxed font-medium",
                                        children: t("reg_promo_installer_desc")
                                    }, void 0, false, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-5 pt-6 border-t border-white/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_leads")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 24
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_approvals")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 24
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BenefitItem, {
                                                text: t("reg_benefit_compliance")
                                            }, void 0, false, {
                                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                                lineNumber: 366,
                                                columnNumber: 24
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, "installer-panel", true, {
                                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                                lineNumber: 348,
                                columnNumber: 18
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 324,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
// --- Styled Components ---
function StyledInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
        ...props,
        className: `h-11 transition-all duration-300 shadow-sm ${className}`
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 379,
        columnNumber: 10
    }, this);
}
function StyledTextarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
        ...props,
        className: `min-h-[100px] transition-all duration-300 shadow-sm ${className}`
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 383,
        columnNumber: 10
    }, this);
}
function StyledFileInput({ label, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                className: "text-xs font-bold uppercase tracking-wider text-slate-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                type: "file",
                ...props,
                className: "h-10 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold cursor-pointer border-slate-200 bg-white hover:bg-slate-50 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                className: "text-sm font-semibold text-slate-700",
                children: label
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 400,
                columnNumber: 39
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 400,
        columnNumber: 10
    }, this);
}
function PasswordField({ label, value, onChange, show, toggle, inputClass }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                className: "text-sm font-semibold text-slate-700",
                children: label
            }, void 0, false, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 406,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledInput, {
                        type: show ? "text" : "password",
                        value: value,
                        onChange: (e)=>onChange(e.target.value),
                        className: inputClass,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: toggle,
                        className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors",
                        children: show ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 410,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                            lineNumber: 410,
                            columnNumber: 52
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
                lineNumber: 407,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 405,
        columnNumber: 5
    }, this);
}
function RegisterPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen w-full flex items-center justify-center",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
            lineNumber: 418,
            columnNumber: 30
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$404SquadSolarConnect$2f$final$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RegisterForm, {}, void 0, false, {
            fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
            lineNumber: 418,
            columnNumber: 114
        }, this)
    }, void 0, false, {
        fileName: "[project]/404SquadSolarConnect/final/app/register/page.tsx",
        lineNumber: 418,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=404SquadSolarConnect_final_fdc376d6._.js.map