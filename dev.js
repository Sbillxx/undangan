const esbuild = require('esbuild');
const http = require('http');

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ['js/guest.js', 'js/admin.js'],
        bundle: true,
        outdir: 'dist',
    });

    await ctx.watch();

    // Jalankan esbuild serve di port internal 8081
    const { port } = await ctx.serve({
        servedir: '.',
        port: 8081,
    });

    // Proxy di port 8080 yang me-rewrite Host header ke 127.0.0.1:8081
    // Ini menghilangkan error 403 saat diakses via ngrok / domain eksternal
    http.createServer((req, res) => {
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                host: `127.0.0.1:${port}`,
            },
        };

        const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });
        proxyReq.on('error', (err) => {
            res.statusCode = 502;
            res.end(`Proxy error: ${err.message}`);
        });
    }).listen(8080, () => {
        console.log(`\n  🚀 Dev server running at http://localhost:8080`);
        console.log(`  🌐 Ngrok ready: Jalankan 'ngrok http 8080' langsung tanpa error 403!\n`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
