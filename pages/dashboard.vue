<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-brand">
        <svg class="header-icon" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0"  width="32" height="7.2" rx="3.6" fill="#FFBE00"/>
          <rect x="0" y="15.2" width="24" height="7.2" rx="3.6" fill="#FFBE00"/>
          <circle cx="4" cy="35" r="4" fill="#FFBE00"/>
        </svg>
        <span class="header-title">fitia</span>
      </div>
      <button class="logout-btn" @click="handleLogout" aria-label="Log out">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>

    <!-- User ID badge + refresh -->
    <div class="user-badge-row">
      <div class="user-badge">
        <span class="user-badge-dot" />
        <span class="user-badge-text">{{ userId }}</span>
      </div>
      <button class="refresh-btn" :class="{ spinning: pending }" aria-label="Refresh stats" @click="refresh()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.51 15a9 9 0 1 0 .49-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="loading-area">
      <div class="loader-ring" />
      <p class="loading-text">Loading your stats…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-card">
      <p class="error-title">Couldn't load data</p>
      <p class="error-body">{{ error.message }}</p>
      <button class="retry-btn" @click="refresh()">Try again</button>
    </div>

    <!-- Main content -->
    <template v-else-if="stats">
      <!-- ─── Product Count ─── -->
      <section class="section">
        <h2 class="section-title">Product Count</h2>

        <div class="stats-card">
          <!-- Total Scanned -->
          <div class="stat-row">
            <div class="stat-left">
              <span class="stat-label">Total Scanned Products</span>
              <InfoPopup
                title="Total Scanned Products"
                description="All the barcodes you scanned. Includes those that were already in the Fitia database and did not require sending images, plus those that were new products and had to be created with photos."
              />
            </div>
            <span class="stat-value">{{ stats.totalScanned.toLocaleString() }}</span>
          </div>

          <div class="divider" />

          <!-- New Scanned -->
          <div class="stat-row">
            <div class="stat-left">
              <span class="stat-label accent-green">New Scanned Products</span>
              <InfoPopup
                title="New Scanned Products"
                description="This includes the products that were new to the Fitia database that you created by taking photos of the product. These are the products that will be taken into account for the payment."
              />
            </div>
            <span class="stat-value accent-green">{{ stats.newScanned.toLocaleString() }}</span>
          </div>

          <div class="divider" />

          <!-- Not New Scans -->
          <div class="stat-row">
            <div class="stat-left">
              <span class="stat-label accent-muted">Not New Scans</span>
              <InfoPopup
                title="Not New Scans"
                description="These are products of which you scanned the barcode, but they already existed in the Fitia database. Duplicate products that are not considered for the payment."
              />
            </div>
            <span class="stat-value accent-muted">{{ stats.notNewScans.toLocaleString() }}</span>
          </div>
        </div>
      </section>

      <!-- ─── Money Earned ─── -->
      <section class="section section-sm">
        <h2 class="section-title section-title-sm">Money Earned</h2>

        <div class="money-card">
          <span class="money-label">Total earnings</span>
          <div class="money-amount">
            <span class="money-currency">$</span>
            <span class="money-number">{{ stats.moneyEarned.toFixed(2) }}</span>
            <span class="money-denom">USD</span>
          </div>
        </div>
      </section>
    </template>

    <!-- Footer space -->
    <div class="footer-space" />
  </div>
</template>

<script setup lang="ts">
interface Stats {
  userId: string
  totalScanned: number
  newScanned: number
  notNewScans: number
  paymentRate: number
  moneyEarned: number
}

const router = useRouter()
const { userId, logout, restoreSession } = useSession()

// Restore session on mount (handles direct page refresh)
onMounted(() => {
  restoreSession()
  if (!userId.value) {
    router.replace('/')
  }
})

// Fetch stats – reactive to userId changes
const { data: stats, pending, error, refresh } = await useFetch<Stats>(
  () => `/api/users/${userId.value}/stats`,
  {
    lazy: true,
    watch: [userId]
  }
)

const handleLogout = () => {
  logout()
  router.replace('/')
}
</script>

<style scoped>
/* ===== Layout ===== */
.dashboard {
  min-height: 100dvh;
  background: #0D0D0F;
  display: flex;
  flex-direction: column;
  padding: 0 0 env(safe-area-inset-bottom, 20px);
  color: #fff;
}

/* ===== Header ===== */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  background: rgba(13,13,15,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 22px;
  height: 29px;
}

.header-title {
  font-size: 22px;
  font-weight: 800;
  color: #FFBE00;
  letter-spacing: -0.5px;
}

.logout-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.logout-btn:active {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

/* ===== User badge row ===== */
.user-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 6px;
}

/* ===== User badge ===== */
.user-badge {
  display: flex;
  align-items: center;
  gap: 7px;
}

.user-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2ECC71;
  box-shadow: 0 0 0 2px rgba(46,204,113,0.25);
  flex-shrink: 0;
}

.user-badge-text {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 0.03em;
}

/* ===== Refresh button ===== */
.refresh-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.refresh-btn:active {
  background: rgba(255,255,255,0.12);
  color: #FFBE00;
}
.refresh-btn svg {
  transition: transform 0.3s ease;
}
.refresh-btn.spinning svg {
  animation: spin 0.8s linear infinite;
}

/* ===== Loading ===== */
.loading-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loader-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,190,0,0.2);
  border-top-color: #FFBE00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loading-text {
  font-size: 14px;
  color: rgba(255,255,255,0.35);
}

/* ===== Error ===== */
.error-card {
  margin: 24px 20px;
  background: rgba(192,57,43,0.12);
  border: 1px solid rgba(192,57,43,0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.error-title { font-size: 16px; font-weight: 700; color: #e74c3c; }
.error-body { font-size: 14px; color: rgba(255,255,255,0.55); }
.retry-btn {
  margin-top: 8px;
  align-self: flex-start;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: rgba(192,57,43,0.25);
  color: #e74c3c;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

/* ===== Sections ===== */
.section {
  padding: 28px 20px 0;
}

.section-sm {
  padding-top: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}

.section-title-sm {
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  font-weight: 600;
  margin-bottom: 10px;
}

/* ===== Stats card ===== */
.stats-card {
  background: #161618;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  gap: 12px;
}

.stat-left {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.stat-label {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  line-height: 1.3;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  flex-shrink: 0;
}

/* Accent colors */
.accent-green { color: #2ECC71 !important; }
.accent-muted { color: rgba(255,255,255,0.4) !important; }

.divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 0 20px;
}

/* ===== Money card ===== */
.money-card {
  background: linear-gradient(135deg, #161618 0%, #1a1a1e 100%);
  border-radius: 16px;
  border: 1px solid rgba(255,190,0,0.18);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.money-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.money-amount {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-top: 2px;
}

.money-currency {
  font-size: 16px;
  font-weight: 700;
  color: #FFBE00;
}

.money-number {
  font-size: 30px;
  font-weight: 800;
  color: #FFBE00;
  letter-spacing: -1px;
  line-height: 1;
}

.money-denom {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,190,0,0.5);
  align-self: flex-end;
  padding-bottom: 3px;
}

/* ===== Footer space ===== */
.footer-space {
  height: 40px;
}
</style>
