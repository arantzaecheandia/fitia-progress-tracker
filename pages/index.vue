<template>
  <div class="login-screen">

    <!--
      Center group: logo image + form stacked, the whole block
      is vertically centered on the phone.
      The image base sits flush above the "Paste…" label.
    -->
    <div class="center-group">

      <!-- Wide logo — almost edge-to-edge with comfortable margins -->
      <img
        src="/fitia-logo-wide.png"
        alt="Fitia"
        class="logo-img"
        draggable="false"
      />

      <!-- Form -->
      <div class="login-card">
        <label class="input-label" for="userId">Paste your Fitia User ID here</label>
        <input
          id="userId"
          v-model="userIdInput"
          class="user-input"
          type="text"
          inputmode="text"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          placeholder="e.g. ABC123xyz"
          :disabled="loading"
          @keydown.enter="handleLogin"
        />
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button
          class="cta-btn"
          :disabled="!userIdInput.trim() || loading"
          @click="handleLogin"
        >
          <span v-if="!loading">See progress</span>
          <span v-else class="spinner" />
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
const { login } = useSession()
const router = useRouter()

const userIdInput = ref('')
const loading = ref(false)
const error = ref('')

onMounted(() => {
  const { userId, restoreSession } = useSession()
  restoreSession()
  if (userId.value) {
    router.replace('/dashboard')
  }
})

const handleLogin = async () => {
  const id = userIdInput.value.trim()
  if (!id) return

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    error.value = 'User ID can only contain letters, numbers, - and _'
    return
  }

  error.value = ''
  loading.value = true

  try {
    login(id)
    await router.push('/dashboard')
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== Full-screen yellow background ===== */
/* #FFC403 — pixel-sampled directly from the logo image for a perfect match */
.login-screen {
  min-height: 100dvh;
  background-color: #FFC403;
  display: flex;
  align-items: center;         /* vertical center */
  justify-content: center;     /* horizontal center */
  padding: 40px 0;
}

/* ===== Center group: logo + form as one unit ===== */
.center-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;                      /* logo base touches the label */
}

/* ===== Wide logo image ===== */
/* Leaves ~18px on each side — nearly edge-to-edge on any phone width */
.logo-img {
  width: calc(100% - 36px);   /* 18px margin each side */
  height: auto;                /* preserve natural aspect ratio — no deformation */
  display: block;
  border-radius: 20px;         /* softens the edge where flat CSS meets image grain */
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  /* small bottom gap so the image doesn't press directly onto the label */
  margin-bottom: 20px;
}

/* ===== Login card ===== */
.login-card {
  width: calc(100% - 36px);   /* same horizontal span as the logo */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== Label ===== */
.input-label {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
  text-align: center;          /* perfectly centered */
}

/* ===== Input ===== */
.user-input {
  width: 100%;
  padding: 15px 18px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.88);
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  color: #111;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  -webkit-appearance: none;
}
.user-input:focus {
  border-color: rgba(0, 0, 0, 0.2);
  background: #fff;
}
.user-input::placeholder {
  color: rgba(0, 0, 0, 0.28);
}
.user-input:disabled { opacity: 0.6; }

/* ===== Error ===== */
.error-msg {
  font-size: 13px;
  color: #6b1900;
  text-align: center;
}

/* ===== CTA button ===== */
.cta-btn {
  margin-top: 2px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #111;
  color: #FFC403;
  font-size: 17px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-appearance: none;
  letter-spacing: 0.01em;
}
.cta-btn:active:not(:disabled) {
  transform: scale(0.97);
  opacity: 0.88;
}
.cta-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ===== Spinner ===== */
.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 196, 3, 0.3);
  border-top-color: #FFC403;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
