import axios from 'axios';

const DEVICE_ID = process.env.EXPO_PUBLIC_X_DEVICE_ID;

const bitnovoApi = axios.create({
  baseURL: 'https://payments.pre-bnvo.com/api/v1/',
  headers: {
    'X-Device-Id': DEVICE_ID,
  },
});

export default bitnovoApi;
