<template>
  <section class="container mx-auto flex flex-col p-4">
    <AddTicker @new-ticker="handleAddNewTicker" :tickers-to-skip="tickers" />
    <TickersList :tickers="tickers" @remove-ticker="handleRemoveTicker" />
  </section>
</template>

<script>
import AddTicker from './AddTicker.vue';
import TickersList from './TickersList.vue';
import { tickersStorage } from '@/storage/persistedStorage';

export default {
  name: 'CryptoDashboard',
  components: { TickersList, AddTicker },
  data() {
    return {
      tickers: [],
    };
  },
  mounted() {
    tickersStorage.retrieveItems();
    if (tickersStorage.items) {
      this.tickers = tickersStorage.items;
    }
  },
  watch: {
    tickers() {
      tickersStorage.setItems(this.tickers);
    },
  },
  methods: {
    handleAddNewTicker(tickerName) {
      const newTicker = {
        name: tickerName,
        price: '-',
      };
      this.tickers = [...this.tickers, newTicker];
    },
    handleRemoveTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove);
    },
  },
};
</script>

<style scoped></style>
