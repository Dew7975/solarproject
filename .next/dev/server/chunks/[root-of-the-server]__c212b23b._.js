module.exports = [
"[externals]/fs [external] (fs, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_fs_54ffce70._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/fs [external] (fs, cjs)");
    });
});
}),
"[externals]/path [external] (path, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_path_e30b8067._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/path [external] (path, cjs)");
    });
});
}),
"[project]/404SquadSolarConnect/final/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/2a892_nodemailer_4f989fd5._.js",
  "server/chunks/[root-of-the-server]__3ca15bca._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/404SquadSolarConnect/final/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
    });
});
}),
];