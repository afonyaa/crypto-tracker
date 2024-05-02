import {API_KEY, WS_URL} from "@/api/constants";


const wsUrl = new URL(WS_URL)
wsUrl.pathname = 'v2'
wsUrl.searchParams.append('api_key', API_KEY);

// const socket = new WebSocket(wsUrl)

const tickerListeners = new Map();

export const subscribeToTickerUpdates = (tickerName, listener) => {
  const listeners = tickerListeners.get(tickerName);
  if (listeners) {
    listeners.push(listener);
  } else {
    tickerListeners.set(tickerName, [listener]);
  }
};

export const unsubscribeToTickerUpdates = (tickerName, unsubscribeListener) => {
  const listeners = tickerListeners.get(tickerName);
  tickerListeners.set(
    tickerName,
    listeners.filter((listener) => listener !== unsubscribeListener),
  );
};


/** Test */
setTimeout(() => {
  for (const [, subscriber] of tickerListeners.entries()) {
    subscriber[0]('3434')
  }
}, 1000)
