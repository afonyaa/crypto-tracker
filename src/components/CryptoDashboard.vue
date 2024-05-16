<template>
  <section class="container mx-auto flex flex-col p-4">
    <AddTicker @new-ticker="handleAddNewTicker" :tickers-to-skip="tickers" />
    <TickersList
      :tickers="tickers"
      :selected="selectedTicker"
      @remove-ticker="handleRemoveTicker"
      @select-ticker="handleSelectTicker"
    />
    <TickerLegend v-if="selectedTicker" :ticker-name="selectedTicker?.name" />
  </section>
</template>

<script>
import AddTicker from './AddTicker.vue';
import TickersList from './TickersList.vue';
import { tickersStorage } from '@/storage/persistedStorage';
import { tickerSubscriber } from '@/api/tickerUpdater';
import TickerLegend from '@/components/TickerLegend.vue';

export default {
  name: 'CryptoDashboard',
  components: { TickerLegend, TickersList, AddTicker },
  data() {
    return {
      tickers: [],
      tickerUpdateSubscribers: [],
      selectedTicker: null,
    };
  },
  mounted() {
    tickersStorage.retrieveItems();
    if (tickersStorage.items) {
      this.tickers = tickersStorage.items;
      this.activateSubscriptionForAllTickers();
    }
  },
  watch: {
    tickers() {
      tickersStorage.setItems(this.tickers);
    },
  },
  methods: {
    handleSelectTicker(ticker) {
      this.selectedTicker = ticker;
    },
    handleAddNewTicker(tickerName) {
      const newTicker = {
        name: tickerName,
        price: null,
        error: false,
      };
      this.tickers = [...this.tickers, newTicker];
      const addedTicker = this.tickers.find((ticker) => ticker.name === newTicker.name);
      this.subscribeToTickerUpdates(addedTicker);
    },
    handleRemoveTicker(tickerToRemove) {
      this.unsubscribeToTickerUpdates(tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove);
    },
    activateSubscriptionForAllTickers() {
      this.tickerUpdateSubscribers = [];
      this.tickers.forEach((ticker) => {
        this.subscribeToTickerUpdates(ticker);
      });
    },
    subscribeToTickerUpdates(ticker) {
      const listener = ({ price, error }) => {
        if (ticker) {
          ticker.price = price;
          ticker.error = error;
        }
      };
      tickerSubscriber.subscribeToTickerUpdates(ticker.name, listener);
      this.tickerUpdateSubscribers.push({ name: ticker.name, listener });
    },
    unsubscribeToTickerUpdates(tickerToUnsubscribe) {
      const subscriber = this.tickerUpdateSubscribers.find(
        (subscriber) => subscriber.name === tickerToUnsubscribe.name,
      );
      tickerSubscriber.unsubscribeToTickerUpdates(subscriber.name, subscriber.listener);
    },
  },
};
</script>

<style scoped></style>
