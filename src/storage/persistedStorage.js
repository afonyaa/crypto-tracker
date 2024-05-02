const TICKERS_STORAGE_KEY = 'cryptonomicon-list';

class PersistedLocalStorage {
  storageKey;
  items;
  constructor(storageKey) {
    this.storageKey = storageKey;
  }
  retrieveItems() {
    this.items = JSON.parse(localStorage.getItem(this.storageKey));
  }
  setItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}

export const tickersStorage = new PersistedLocalStorage(TICKERS_STORAGE_KEY);
