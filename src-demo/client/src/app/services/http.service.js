import axios from "axios";
import { toastDarkBounce } from "../utils/animateTostify";
import configFile from "../config/default.json";
import authService from "./auth.service";

import localStorageService from "./localStorage.service";


const http = axios.create({
    baseURL: configFile.isFireBase
        ? process.env.NODE_ENV === "production"
            ? configFile.apiDataEndpointProd
            : configFile.apiDataEndpoint
        : configFile.apiEndpoint,

});
// const dispatch = useDispatch();

http.interceptors.request.use(
    async function (config) {
        if (configFile.isFireBase) {
          // const containSlash = /\/$/gi.test(config.url);
          // config.url =
          //     (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
          const expiresDate = localStorageService.getTokenExpiresDate();
          const refreshToken = localStorageService.getRefreshToken();
          const stayOn = localStorageService.getLoggedStatus();

          const expireSession = Math.floor(
            (Math.abs(Date.now() - expiresDate) / (1000 * 3600)) % 24
          );
          if (
            refreshToken &&
            expiresDate < Date.now() ) {
            const data = await authService.refresh();
            localStorageService.setTokens(data);
          }

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          // Если сессия просрочена более чем на 3 часа автоматически разлогиниваемся
          if (expireSession >= 3) {
            config.headers = {
              ...config.headers,
              Authorization: '',
              Session_Expire: true,
            };
          }
        }
        return config;
    },
    function (error) {
        console.log("Обнаружена ошибка при работе запроса");
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (res) => {
        return res;
    },
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors && error.response.data?.type !== "expires") {
            toastDarkBounce(
                `При запросе данных произошла ошибка: ${
                    error.response?.data?.message || error.message || error
                }`
            );
        }
        return Promise.reject(error);
    }
);
const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};
export default httpService;
