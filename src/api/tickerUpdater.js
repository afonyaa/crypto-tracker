import { ADD_TICKER_TO_WS_LISTEN, REMOVE_TICKER_TO_WS_LISTEN } from '@/api/constants';
import { getWSUrl } from '@/api/utils';

class WSTicketListener {
  socket;

  constructor(url) {
    this.socket = new WebSocket(url);
  }

  sendMessage(tickerName, action) {
    const message = JSON.stringify({ action: action, subs: [`5~CCCAGG~${tickerName}~USD`] });
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
    this.socket.addEventListener(
      'open',
      () => {
        this.socket.send(message);
      },
      { once: true },
    );
  }

  startListening(tickerListeners) {
    this.socket.addEventListener('message', (e) => {
      const AGGREGATE_INDEX = '5';
      const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
      if (type !== AGGREGATE_INDEX) {
        return;
      }
      const handlers = tickerListeners.get(currency) ?? [];
      handlers.forEach((handler) => handler(newPrice));
    });
  }
}

class TickerSubscriber {
  wsTickerListener = new WSTicketListener(getWSUrl());
  tickerListeners = new Map();

  constructor() {
    this.wsTickerListener.startListening(this.tickerListeners);
  }

  subscribeToTickerUpdates = (tickerName, listener) => {
    const listeners = this.tickerListeners.get(tickerName);
    if (listeners) {
      listeners.push(listener);
    } else {
      this.tickerListeners.set(tickerName, [listener]);
      this.wsTickerListener.sendMessage(tickerName, ADD_TICKER_TO_WS_LISTEN);
    }
  };
  unsubscribeToTickerUpdates = (tickerName, unsubscribeListener) => {
    const listeners = this.tickerListeners.get(tickerName);
    this.tickerListeners.set(
      tickerName,
      listeners.filter((listener) => listener !== unsubscribeListener),
    );
    if (!this.tickerListeners.get(tickerName).length) {
      this.wsTickerListener.sendMessage(tickerName, REMOVE_TICKER_TO_WS_LISTEN);
    }
  };
}

export const tickerSubscriber = new TickerSubscriber();
