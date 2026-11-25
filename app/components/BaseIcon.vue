<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 20,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
  >
    <g v-if="name === 'alert-triangle'">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </g>
    <g v-else-if="name === 'alert-circle'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </g>
    <g v-else-if="name === 'arrow-down'">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </g>
    <g v-else-if="name === 'arrow-left'">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </g>
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </g>
    <g v-else-if="name === 'arrow-up'">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </g>
    <g v-else-if="name === 'bell'">
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </g>
    <g v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </g>
    <g v-else-if="name === 'check'">
      <path d="M20 6 9 17l-5-5" />
    </g>
    <g v-else-if="name === 'check-circle'">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </g>
    <g v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </g>
    <g v-else-if="name === 'chevron-left'">
      <path d="m15 18-6-6 6-6" />
    </g>
    <g v-else-if="name === 'chevron-right'">
      <path d="m9 18 6-6-6-6" />
    </g>
    <g v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
    <g v-else-if="name === 'copy'">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </g>
    <g v-else-if="name === 'equals'">
      <path d="M5 9h14M5 15h14" />
    </g>
    <g v-else-if="name === 'external-link'">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </g>
    <g v-else-if="name === 'eye'">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
    <g v-else-if="name === 'eye-off'">
      <path d="m3 3 18 18" />
      <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1" />
      <path d="M6.6 6.6C3.6 8.8 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5.4-1.4" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </g>
    <g v-else-if="name === 'file-text'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h6" />
    </g>
    <g v-else-if="name === 'filter'">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54Z" />
    </g>
    <g v-else-if="name === 'inbox'">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </g>
    <g v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </g>
    <g v-else-if="name === 'loader'">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </g>
    <g v-else-if="name === 'lock'">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </g>
    <g v-else-if="name === 'logout'">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </g>
    <g v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </g>
    <g v-else-if="name === 'menu'">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </g>
    <g v-else-if="name === 'message'">
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </g>
    <g v-else-if="name === 'plus'">
      <path d="M5 12h14M12 5v14" />
    </g>
    <g v-else-if="name === 'refresh'">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </g>
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </g>
    <g v-else-if="name === 'settings'">
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3" />
      <path d="M14 2v4M8 10v4M16 18v4" />
    </g>
    <g v-else-if="name === 'shield'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </g>
    <g v-else-if="name === 'sliders'">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </g>
    <g v-else-if="name === 'sparkles'">
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
      <path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8Z" />
    </g>
    <g v-else-if="name === 'user'">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </g>
    <g v-else-if="name === 'users'">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
    <g v-else-if="name === 'x'">
      <path d="M18 6 6 18M6 6l12 12" />
    </g>
    <g v-else>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 11v5" />
    </g>
  </svg>
</template>
