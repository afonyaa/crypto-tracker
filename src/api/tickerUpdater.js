import { ADD_TICKER_TO_WS_LISTEN, REMOVE_TICKER_TO_WS_LISTEN } from '@/api/constants';
import { getWSUrl } from '@/api/utils';

class WorkerTickerListener {
  port;
  constructor() {
    const worker = new SharedWorker('shareTickersPricesWorker.js');
    this.port = worker.port;
  }
  broadcastNewPrice({ tickerName, price, error }) {
    this.port.postMessage({ tickerName, price, error });
  }
}

class WSTickerListener {
  socket;
  worker;

  constructor(url) {
    this.socket = new WebSocket(url);
    this.worker = new WorkerTickerListener();
  }

  startListenCurrency(tickerName, action) {
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

  notifySubscribers(subscribers, { tickerName, price, error }) {
    const handlers = subscribers.get(tickerName) ?? [];
    handlers.forEach((handler) => handler({ price, error }));
  }

  activateIncomingEventsListener(subscribers) {
    this.socket.addEventListener('message', (e) => {
      const AGGREGATE_INDEX = '5';
      const MULTIPLE_SOCKETS_ERROR = '429';
      const INVALID_SUB = '500';

      const {
        TYPE: type,
        FROMSYMBOL: tickerName,
        PRICE: price,
        PARAMETER: tickerNameInCaseOfError,
      } = JSON.parse(e.data);

      const isErrorWhileRetrievingPrice = type === INVALID_SUB;
      let tickerNameInCaseOfErrorParsed =
        tickerNameInCaseOfError && tickerNameInCaseOfError.split('~')?.[2];

      if (type === AGGREGATE_INDEX || isErrorWhileRetrievingPrice) {
        this.worker.broadcastNewPrice({
          tickerName: tickerName,
          price,
          error: isErrorWhileRetrievingPrice,
        });
        this.notifySubscribers(subscribers, {
          tickerName: tickerName || tickerNameInCaseOfErrorParsed,
          price,
          error: isErrorWhileRetrievingPrice,
        });
      }
      if (type === MULTIPLE_SOCKETS_ERROR) {
        this.worker.port.onmessage = (e) => {
          const { tickerName, price } = e.data;
          this.notifySubscribers(subscribers, {
            tickerName: tickerName,
            price,
            error: isErrorWhileRetrievingPrice,
          });
        };
      }
    });
  }
}

class TickerSubscriber {
  wsTickerListener = new WSTickerListener(getWSUrl());
  tickerListeners = new Map();

  constructor() {
    this.wsTickerListener.activateIncomingEventsListener(this.tickerListeners);
  }

  subscribeToTickerUpdates = (tickerName, listener) => {
    const listeners = this.tickerListeners.get(tickerName);
    if (listeners?.length > 0) {
      listeners.push(listener);
    } else {
      this.tickerListeners.set(tickerName, [listener]);
      this.wsTickerListener.startListenCurrency(tickerName, ADD_TICKER_TO_WS_LISTEN);
    }
  };
  unsubscribeToTickerUpdates = (tickerName, unsubscribeListener) => {
    const listeners = this.tickerListeners.get(tickerName);
    this.tickerListeners.set(
      tickerName,
      listeners.filter((listener) => listener !== unsubscribeListener),
    );
    if (!this.tickerListeners.get(tickerName).length) {
      this.wsTickerListener.startListenCurrency(tickerName, REMOVE_TICKER_TO_WS_LISTEN);
    }
  };
}

export const tickerSubscriber = new TickerSubscriber();
