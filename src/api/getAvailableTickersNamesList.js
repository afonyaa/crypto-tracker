import { API_KEY } from '@/api/constants';

//todo search params

export default () =>
  fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=false&api_key=${API_KEY}`)
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
