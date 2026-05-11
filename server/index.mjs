import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const port = Number(process.env.PORT || process.env.API_PORT || 8787)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
}

function json(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...securityHeaders(),
  })
  response.end(JSON.stringify(body))
}

function securityHeaders() {
  return {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  }
}

async function sendFile(response, filePath) {
  const extension = extname(filePath)
  const contentType = mimeTypes[extension] || 'application/octet-stream'
  const body = await readFile(filePath)
  response.writeHead(200, {
    'content-type': contentType,
    'cache-control': extension === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
    ...securityHeaders(),
  })
  response.end(body)
}

async function resolveStaticPath(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, '')
  const candidate = join(dist, cleanPath || 'index.html')
  if (!candidate.startsWith(dist)) return join(dist, 'index.html')
  if (existsSync(candidate) && (await stat(candidate)).isFile()) return candidate
  return join(dist, 'index.html')
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost')
    if (url.pathname === '/api/health') {
      return json(response, 200, {
        ok: true,
        service: 'ForgeCloud IDE',
        environment: process.env.NODE_ENV || 'development',
        frontend: existsSync(dist) ? 'dist-ready' : 'dist-missing-run-npm-build',
        timestamp: new Date().toISOString(),
      })
    }

    if (url.pathname.startsWith('/api/')) {
      return json(response, 501, {
        error: 'Backend provider not configured for this endpoint yet.',
        next: 'Connect managed Postgres, Stripe, email, and deployment provider services.',
      })
    }

    const filePath = await resolveStaticPath(url.pathname)
    return sendFile(response, filePath)
  } catch (error) {
    return json(response, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
  }
}).listen(port, () => {
  console.log(`ForgeCloud IDE server listening on ${port}`)
})
