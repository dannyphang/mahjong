import envLocal from './environment.json';
import envProd from './environment.prod.json';
import { isDevMode } from '@angular/core';

const isProd = !isDevMode();
const isServerConnect = false;

const apiConfig = {
    baseUrl: isProd || isServerConnect ? envProd.baseUrl : envLocal.baseUrl,
    socketUrl: isProd || isServerConnect ? envProd.socketEndpoint : envLocal.socketEndpoint,
    eventUrl: isProd || isServerConnect ? envProd.event : envLocal.event,
};
export default apiConfig;