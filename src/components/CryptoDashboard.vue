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
import { tickerSubscriber } from '@/api/tickerUpdater';

export default {
  name: 'CryptoDashboard',
  components: { TickersList, AddTicker },
  data() {
    return {
      tickers: [],
      tickerUpdateSubscribers: [],
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
    handleAddNewTicker(tickerName) {
      const newTicker = {
        name: tickerName,
        price: null,
      };
      this.tickers = [...this.tickers, newTicker];
      const addedTicker = this.tickers.find((ticker) => ticker.name === newTicker.name);
      this.subscribeToTickerUpdates(addedTicker);
    },
    handleRemoveTicker(tickerToRemove) {
      this.unsubscribeToTickerUpdates(tickerToRemove);
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove);
    },
    activateSubscriptionForAllTickers() {
      this.tickerUpdateSubscribers = [];
      this.tickers.forEach((ticker) => {
        this.subscribeToTickerUpdates(ticker);
      });
    },
    subscribeToTickerUpdates(ticker) {
      const listener = (price) => {
        if (ticker) {
          ticker.price = price;
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
