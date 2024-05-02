import { API_KEY, WS_URL } from '@/api/constants';

/** Logic with websockets */
const wsUrl = new URL(WS_URL);

wsUrl.pathname = 'v2';
wsUrl.searchParams.append('api_key', API_KEY);

const socket = new WebSocket(wsUrl);

const ADD_TICKER_TO_WS_LISTEN = 'SubAdd';
const REMOVE_TICKER_TO_WS_LISTEN = 'SubRemove';

const sendMessageToWS = (tickerName, action) => {
  const message = JSON.stringify({ action: action, subs: [`5~CCCAGG~${tickerName}~USD`] });
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
  socket.addEventListener(
    'open',
    () => {
      socket.send(message);
    },
    { once: true },
  );
};

/** Логика, которая на стыке с прослушиванием сокетов и работой с подписчиками */
const AGGREGATE_INDEX = '5';
socket.addEventListener('message', (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX) {
    return;
  }
  // стык здесь
  const handlers = tickerListeners.get(currency) ?? [];
  handlers.forEach((handler) => handler(newPrice));
});

/** Логика по работе со слушателями событий */
const tickerListeners = new Map();

export const subscribeToTickerUpdates = (tickerName, listener) => {
  const listeners = tickerListeners.get(tickerName);
  if (listeners) {
    listeners.push(listener);
  } else {
    tickerListeners.set(tickerName, [listener]);
    sendMessageToWS(tickerName, ADD_TICKER_TO_WS_LISTEN);
  }
};

export const unsubscribeToTickerUpdates = (tickerName, unsubscribeListener) => {
  const listeners = tickerListeners.get(tickerName);
  tickerListeners.set(
    tickerName,
    listeners.filter((listener) => listener !== unsubscribeListener),
  );
  if (!tickerListeners.get(tickerName).length) {
    sendMessageToWS(tickerName, REMOVE_TICKER_TO_WS_LISTEN);
  }
};
