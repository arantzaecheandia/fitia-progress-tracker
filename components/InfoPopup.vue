<template>
  <!-- Info trigger icon -->
  <button
    class="info-btn"
    :aria-label="`Info about ${title}`"
    @click.stop="open = true"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" stroke-opacity="0.55"/>
      <path d="M8 7v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="8" cy="4.5" r="0.875" fill="currentColor"/>
    </svg>
  </button>

  <!-- Backdrop + popup -->
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="open" class="popup-backdrop" @click.self="open = false">
        <div class="popup-sheet" role="dialog" :aria-label="title">
          <div class="popup-handle" />
          <h3 class="popup-title">{{ title }}</h3>
          <p class="popup-body">{{ description }}</p>
          <button class="popup-close" @click="open = false">Got it</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
}>()

const open = ref(false)
</script>

<style scoped>
/* ---- Trigger button ---- */
.info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.info-btn:active {
  color: #FFBE00;
  background: rgba(255,190,0,0.12);
}

/* ---- Backdrop ---- */
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* ---- Bottom sheet ---- */
.popup-sheet {
  width: 100%;
  background: #1C1C1E;
  border-radius: 20px 20px 0 0;
  padding: 12px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-handle {
  width: 36px;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 99px;
  align-self: center;
  margin-bottom: 4px;
}

.popup-title {
  font-size: 17px;
  font-weight: 700;
  color: #FFBE00;
  line-height: 1.3;
}

.popup-body {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255,255,255,0.8);
}

.popup-close {
  margin-top: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #FFBE00;
  color: #111;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
}
.popup-close:active { opacity: 0.8; }

/* ---- Transitions ---- */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.2s ease;
}
.popup-enter-active .popup-sheet,
.popup-leave-active .popup-sheet {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-from .popup-sheet,
.popup-leave-to .popup-sheet {
  transform: translateY(100%);
}
</style>
