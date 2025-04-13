<template>
  <div ref="el" class="my-4">
    <div
      class="strava-embed-placeholder"
      data-embed-type="activity"
      :data-embed-id="props.embedId"
      data-style="standard"
    />
    <button v-if="!consent" class="px-4 py-2 bg-[#fc5200] text-white rounded" @click="consent = '1'">
      Allow Strava content
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  embedId: string
}

const props = defineProps<Props>()

const consent = useCookie('stravaEmbedConsent')

const previouslyBootstrapped = window && window.__STRAVA_EMBED_BOOTSTRAP__

useScript({
  src: 'https://strava-embeds.com/embed.js',
  crossorigin: false,
}, {
  trigger: computed(() => Boolean(consent.value)),
})

// Bootstrap also further embeds when navigating the single-page app
onMounted(() => {
  if (previouslyBootstrapped && window.__STRAVA_EMBED_BOOTSTRAP__) {
    window.__STRAVA_EMBED_BOOTSTRAP__()
  }
})
</script>
