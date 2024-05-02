import { API_KEY, REST_URL } from '@/api/constants';

export default () => {
  const tickersListURL = new URL(REST_URL);
  tickersListURL.pathname = 'data/all/coinlist';
  tickersListURL.searchParams.append('summary', 'false');
  tickersListURL.searchParams.append('api_key', API_KEY);
  return fetch(tickersListURL.href)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.Response === 'Error') {
        return Promise.reject('Failed to fetch currency list');
      } else {
        return Object.values(res.Data).map((currency) => currency.Name);
      }
    });
};
