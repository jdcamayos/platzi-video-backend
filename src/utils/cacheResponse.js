import { config } from '../config/index.js'

export default function cacheResponse(res, seconds) {
  if (!config.dev) {
    res.set('Cache-Control', `public, max-age=${seconds}`)
  }
}
