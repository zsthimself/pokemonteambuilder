import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

const DEBUG = false

const defaultOptions = {
  ASSET_NAMESPACE: 'STATIC_ASSETS',
  ASSET_MANIFEST: 'ASSET_MANIFEST',
  cacheControl: {
    browserTTL: 60 * 60 * 24 * 365, // 1 year
    edgeTTL: 60 * 60 * 24 * 365, // 1 year
    bypassCache: false,
  },
}

const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

async function handleEvent(event) {
  try {
    const options = defaultOptions
    const url = new URL(event.request.url)
    const extension = url.pathname.split('.').pop()
    
    // 设置正确的Content-Type
    if (extension && mimeTypes[`.${extension}`]) {
      options.mapRequestToAsset = req => {
        const asset = getAssetFromKV.mapRequestToAsset(req)
        asset.headers.set('Content-Type', mimeTypes[`.${extension}`])
        return asset
      }
    }

    const page = await getAssetFromKV(event, options)
    const response = new Response(page.body, page)

    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    response.headers.set('Feature-Policy', "camera 'none'; microphone 'none'")

    return response

  } catch (e) {
    if (DEBUG) {
      return new Response(e.message || e.toString(), {
        status: 500,
      })
    }
    return new Response('Internal Error', { status: 500 })
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})