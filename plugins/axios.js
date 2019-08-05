import axios from 'axios';

const config = {
  apiHost: 'https://pcapi.ccuol.com'
};

if (process.env.NODE_ENV === 'development') {
  window.config = config;
}

axios.defaults.baseURL = config.apiHost;