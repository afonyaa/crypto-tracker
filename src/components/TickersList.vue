<template>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="ticker of tickers"
      :key="ticker.name"
      class="bg-gray-400 rounded-lg shadow-lg p-8 text-center"
    >
      <h1 class="text-lg font-bold text-white mb-4">{{ ticker.name }} - USD</h1>
      <p class="text-md text-white mb-8">-</p>
    </div>
  </dl>
</template>

<script>
export default {
  name: 'TickersList',
  props: {
    tickers: [Object],
  },
};
</script>

<style scoped></style>
