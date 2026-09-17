// resources/js/bootstrap.js

import _ from 'lodash';
window._ = _;

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Impor konfigurasi Echo dari file terpisah
import './echo.js';
