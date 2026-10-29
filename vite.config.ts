import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const inferredBase =
    repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/';
  const rawBase = env.VITE_BASE_PATH || inferredBase;
  const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
  const siteUrl =
    (env.VITE_SITE_URL || `https://nicolas-gatta.github.io${base}`).replace(
      /\/$/,
      ''
    ) + '/';
  return {
    base,
    plugins: [
      react(),
      {
        name: 'portfolio-static-metadata',
        transformIndexHtml: {
          order: 'post',
          handler(html, context) {
            const font = Object.values(context.bundle || {}).find((asset) =>
              asset.fileName.endsWith('.woff2')
            );
            return {
              html: html.replaceAll('__SITE_URL__', siteUrl),
              tags: font
                ? [
                    {
                      tag: 'link',
                      attrs: {
                        rel: 'preload',
                        href: `${base}${font.fileName}`,
                        as: 'font',
                        type: 'font/woff2',
                        crossorigin: '',
                      },
                      injectTo: 'head' as const,
                    },
                  ]
                : [],
            };
          },
        },
        generateBundle() {
          // HashRouter routes share a single canonical document; never put hash URLs in a sitemap.
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>\n`,
          });
          this.emitFile({
            type: 'asset',
            fileName: 'robots.txt',
            source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
          });
          this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
          this.emitFile({
            type: 'asset',
            fileName: '404.html',
            source: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#f4f5f2"><title>Page not found — Nicolas Gatta</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f5f2;color:#17191c;font:15px/1.7 system-ui,sans-serif;text-align:center;padding:24px}main{max-width:800px;width:100%;padding:70px 16px;border-top:1px solid #dce0dd;border-bottom:1px solid #dce0dd}small{font:10px monospace;letter-spacing:.12em;color:#5b6874}h1{font-size:clamp(60px,12vw,120px);font-weight:350;letter-spacing:-.07em;line-height:1.1;margin:40px 0 24px}h1 span{color:#35a6c8}p{color:#5b6874;font-size:14px}a{display:inline-block;margin:24px 0;padding:12px 24px;background:#17191c;color:#fff;text-decoration:none;border-radius:3px;font-size:13px}a:focus-visible{outline:3px solid #15718d;outline-offset:5px}</style></head><body><main><small>N.GATTA / ERROR 404 / CONNECTION LOST</small><h1>YOU DIED<span>.</span></h1><p>The page you were looking for has returned to the bonfire.</p><a href="${siteUrl}">← Return Home</a></main></body></html>`,
          });
        },
      },
    ],
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1' },
    build: { target: 'es2020' },
  };
});
