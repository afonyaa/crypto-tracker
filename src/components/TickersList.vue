<template>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="ticker of tickers"
      :key="ticker.name"
      class="bg-gray-400 rounded-lg shadow-lg p-8 text-center"
      :class="{ 'bg-red-300': ticker.error }"
    >
      <h1 class="text-lg font-bold text-white mb-4">{{ ticker.name }} - USD</h1>
      <p class="text-md text-white mb-8">{{ formatTickerPrice(ticker.price) }}</p>
      <button
        @click="$emit('removeTicker', ticker)"
        class="bg-white hover:bg-gray-100 text-gray-500 text-xs font-semibold py-2 px-4 rounded"
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
  methods: {
    formatTickerPrice(tickerPrice) {
      if (!tickerPrice) {
        return '-';
      } else {
        return tickerPrice > 1 ? tickerPrice.toFixed(2) : tickerPrice.toPrecision(2);
      }
    },
  },
};
</script>

<style scoped></style>
