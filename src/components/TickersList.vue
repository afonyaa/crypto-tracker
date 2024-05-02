<template>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="ticker of tickers"
      :key="ticker.name"
      class="bg-gray-400 rounded-lg shadow-lg p-8 text-center"
    >
      <h1 class="text-lg font-bold text-white mb-4">{{ ticker.name }} - USD</h1>
      <p class="text-md text-white mb-8">{{ ticker.price }}</p>
      <button
        @click="$emit('removeTicker', ticker)"
        class="bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2 px-4 border border-gray-400 rounded"
      >
        Remove
      </button>
    </div>
  </dl>
</template>

<script>
export default {
  name: 'TickersList',
  emits: ['removeTicker'],
  props: {
    tickers: [Object],
  },
};
</script>

<style scoped></style>
