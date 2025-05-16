import axios from 'axios';

const bitnovoApi = axios.create({
  baseURL: 'https://payments.pre-bnvo.com/api/v1/',
  headers: {
    'X-Device-Id': 'd497719b-905f-4a41-8dbe-cf124c442f42',
  },
});

export default bitnovoApi;
