import envLocal from './environment.json';
import envProd from './environment.prod.json';
import { isDevMode } from '@angular/core';

const isProd = !isDevMode();
const isServerConnect = false;
const isAuthServerConnect = true;
const isAuthClientConnect = true;

const apiConfig = {
    clientUrl: isProd || isServerConnect ? envProd.clientUrl : envLocal.clientUrl,
    baseUrl: isProd || isServerConnect ? envProd.baseUrl : envLocal.baseUrl,
    socketUrl: isProd || isServerConnect ? envProd.socketEndpoint : envLocal.socketEndpoint,
    eventUrl: isProd || isServerConnect ? envProd.event : envLocal.event,
    authClient: isProd || isAuthClientConnect ? envProd.authClient : envLocal.authClient,
    authUrl: isProd || isAuthServerConnect ? envProd.auth : envLocal.auth,
};
export default apiConfig;