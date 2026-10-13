/**
 * GET /api/users/:userId/stats
 *
 * MOCK implementation – replace with real DB queries in production.
 *
 * Response shape:
 * {
 *   userId: string
 *   totalScanned: number        // All barcodes scanned (new + not new)
 *   newScanned: number          // Products newly created with photos
 *   notNewScans: number         // Already-existing products (totalScanned - newScanned)
 *   paymentRate: number         // USD per new product (e.g. 0.08 or 0.10)
 *   moneyEarned: number         // newScanned * paymentRate
 * }
 */
export default defineEventHandler((event) => {
  const userId = getRouterParam(event, 'userId') ?? ''

  // ---------------------------------------------------------------------------
  // Mock data – replace with real database lookup
  // ---------------------------------------------------------------------------

  // Payment rate: users whose IDs end with an odd digit get $0.10, others $0.08
  const lastChar = userId.slice(-1)
  const isHighRate = ['1', '3', '5', '7', '9'].includes(lastChar)
  const paymentRate = isHighRate ? 0.10 : 0.08

  // Deterministic pseudo-random counts based on userId length (for demo variety)
  const seed = userId.length * 7 + userId.charCodeAt(0) || 42
  const totalScanned = 50 + (seed % 200)
  const newScanned = Math.floor(totalScanned * 0.45) + (seed % 20)
  const notNewScans = totalScanned - newScanned
  const moneyEarned = parseFloat((newScanned * paymentRate).toFixed(2))

  // Return 404 for empty userId
  if (!userId) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    userId,
    totalScanned,
    newScanned,
    notNewScans,
    paymentRate,
    moneyEarned
  }
})
