<script setup>
  const props = defineProps({
    achievement: Object,
  });

  const type = props.achievement.condition.col;
  let completion = props.achievement.condition.value;
  let progress = props.achievement.progress;

  if (typeof completion === 'boolean') completion = 1;
  // Falls man möchte, dass bei erfüllter Anforderung auf der linken Seite
  // nur der maximal Wert und nicht der eigentliche aktuelle Wert angezeigt wird.
  // (z.B. bei "5200 / 5000 XP"; "5000 / 5000 XP")
  // if (progress > completion) progress = completion;
</script>

<template>
  <div v-if="type === 'xp' || type === 'pulls_count'">
    <progress class="progress w-50 mr-4" :value="progress" :max="completion"></progress>
    <span
      ><span class="">{{ progress }}</span> / {{ completion }}
      <span v-if="type === 'xp'">XP</span>
    </span>
  </div>
</template>

<style scoped></style>
