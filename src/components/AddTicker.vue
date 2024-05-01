<template>
  <div class="mt-4 mb-1">
    <label for="price" class="block text-sm font-medium leading-6 text-gray-900"
      >Search for ticker</label
    >
    <div class="flex mt-2 gap-2">
      <div class="relative rounded-md">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span class="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          :disabled="allTickers.isLoading"
          @keydown.enter="addTicker"
          v-model="ticker"
          type="text"
          class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Example: BTC"
        />
      </div>
      <div
        v-if="allTickers.isLoading"
        class="border-gray-300 h-9 w-9 animate-spin rounded-full border-8 border-t-gray-900"
      />
      <button
        v-else
        @click="addTicker"
        :disabled="!canAddTicker"
        class="bg-gray-700 h-9 hover:bg-gray-900 text-white transition-colors text-sm py-0 px-4 font-bold rounded"
        :class="{ 'opacity-70 pointer-events-none cursor-not-allowed': !canAddTicker }"
      >
        Add ticker
      </button>
    </div>
  </div>
  <div>
    <span v-if="allTickers.loadingErrorMessage" class="text-sm text-red-500"
      >Error to fetch available tickers</span
    >
    <div v-else class="flex h-8">
      <UIChip
        class="cursor-pointer hover:bg-indigo-50"
        @click="handleSuggestedTickerClick(ticker)"
        v-for="ticker of suggestedTickers"
        :text="ticker"
        :key="ticker"
      />
    </div>
  </div>
</template>

<script>
import getAvailableTickersNamesList from '../api/getAvailableTickersNamesList';
import UIChip from '@/components/ui/UIChip.vue';

export default {
  name: 'AddTicker',
  props: {
    tickersToSkip: { type: [{}], required: true },
  },
  components: { UIChip },
  emits: ['newTicker'],
  data() {
    return {
      ticker: '',
      allTickers: {
        data: [],
        isLoading: false,
        loadingErrorMessage: '',
      },
    };
  },
  methods: {
    handleSuggestedTickerClick(ticker) {
      this.ticker = ticker;
    },
    addTicker() {
      if (this.canAddTicker) {
        this.$emit('newTicker', this.ticker);
        this.ticker = '';
      }
    },
  },
  computed: {
    canAddTicker() {
      return this.suggestedTickers.find((ticker) => ticker === this.ticker.toUpperCase());
    },
    availableTickers() {
      const tickersToSkipSet = new Set(this.tickersToSkip.map((ticker) => ticker.name));
      const allTickersSet = new Set(this.allTickers.data);
      return [...allTickersSet.difference(tickersToSkipSet)];
    },
    suggestedTickers() {
      const MAX_TICKERS_TO_DISPLAY = 4;
      return this.ticker
        ? this.availableTickers
            .filter((ticker) => ticker.toUpperCase().includes(this.ticker.toUpperCase()))
            .slice(0, MAX_TICKERS_TO_DISPLAY)
        : [];
    },
  },
  mounted() {
    this.allTickers.isLoading = true;
    getAvailableTickersNamesList()
      .then((res) => {
        this.allTickers.data = res;
      })
      .catch((err) => {
        this.allTickers.loadingErrorMessage = err;
      })
      .finally(() => {
        this.allTickers.isLoading = false;
      });
  },
};
</script>

<style scoped></style>
