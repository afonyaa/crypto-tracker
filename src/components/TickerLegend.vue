<template>
  <section class="mt-8">
    <div class="h-6">
      <h1 class="text-gray-500 font-medium">Chart for: {{ tickerName }}</h1>
    </div>
    <div
      ref="chartWrapper"
      class="w-full h-96 gap-0.5 mt-2 bg-zinc-50 border-4 pt-3 flex items-end border-l-gray-300 border-b-gray-300 border-t-0 border-r-0"
    >
      <div
        v-for="(pricePercentage, idx) of priceHistoryNormalized"
        :key="idx"
        ref="chartBar"
        class="bg-cyan-400 w-10"
        :style="{ height: `${pricePercentage}%` }"
      />
    </div>
  </section>
</template>
<script>
import { tickerSubscriber } from '@/api/tickerUpdater';

const GRAPH_BAR_WIDTH = 40;

export default {
  name: 'TickerLegend',
  props: {
    tickerName: String,
  },
  data() {
    return {
      priceHistory: [],
      maxGraphElements: 0,
    };
  },
  mounted() {
    if (this.$refs.chartWrapper) {
      this.calculateMaxGraphElements();
      window.addEventListener('resize', this.calculateMaxGraphElements);
    }
  },
  beforeUnmount() {
    tickerSubscriber.unsubscribeToTickerUpdates(this.tickerName, this.subscriberForTickerPrice);
    window.removeEventListener('resize', this.calculateMaxGraphElements);
  },
  computed: {
    priceHistoryNormalized() {
      if (this.priceHistory.length === 0) {
        return [];
      }
      if (this.priceHistory.length === 1) {
        return [100];
      }
      const lastNCurrenciesList =
        this.priceHistory.length > this.maxGraphElements
          ? this.priceHistory.slice(Math.max(this.priceHistory.length - this.maxGraphElements, 0))
          : this.priceHistory;

      const maxPrice = Math.max(...lastNCurrenciesList);
      const minPrice = Math.min(...lastNCurrenciesList);
      return lastNCurrenciesList.map(
        (price) => ((price - minPrice) / (maxPrice - minPrice)) * 95 + 5,
      );
    },
  },
  methods: {
    subscriberForTickerPrice({ price }) {
      this.priceHistory = [...this.priceHistory, price];
    },
    calculateMaxGraphElements() {
      this.maxGraphElements = this.$refs.chartWrapper.offsetWidth / GRAPH_BAR_WIDTH;
    },
  },
  watch: {
    tickerName: {
      handler(current, prev) {
        this.priceHistory = [];
        if (current) {
          tickerSubscriber.subscribeToTickerUpdates(current, this.subscriberForTickerPrice);
        }
        if (prev) {
          tickerSubscriber.unsubscribeToTickerUpdates(prev, this.subscriberForTickerPrice);
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped></style>
