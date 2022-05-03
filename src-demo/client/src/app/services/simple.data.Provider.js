import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import appConfig from '../config/default.json';
import httpService from './http.service';

const apiUrl = appConfig.isFireBase
  ? process.env.NODE_ENV === 'production'
    ? appConfig.apiDataEndpointProd
    : appConfig.apiDataEndpoint
  : appConfig.apiEndpoint;
const httpClient = httpService;

export default {
  getList: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return httpClient
      .get(url, {
        headers: {
          ProviderRequest: 'getList',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
          total: data ? data.length : 0,
        };
      }).catch(err => console.log(err));
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return await httpClient
      .get(url, {
        headers: {
          ProviderRequest: 'getOne',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
          total: data ? data.length : 0,
        };
      });
  },

  getMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return await httpClient
      .get(url, {
        headers: {
          ProviderRequest: 'getMany',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
          total: data ? data.length : 0,
        };
      });
  },

  getManyReference: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return await httpClient
      .get(url, {
        headers: {
          ProviderRequest: 'getManyReference',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
          total: data ? data.length : 0,
        };
      });
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return await httpClient
      .put(url, {
        body: JSON.stringify(params.data),
        data: JSON.stringify(params),
        headers: {
          ProviderRequest: 'update',
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  updateMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return await httpClient
      .put(url, {
        data: JSON.stringify(params),
        headers: {
          ProviderRequest: 'updateMany',
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return await httpClient
      .post(url, {
        body: JSON.stringify(params.data),
        data: JSON.stringify(params),
        headers: {
          ProviderRequest: 'create',
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return await httpClient
      .delete(url, {
        headers: {
          ProviderRequest: 'delete',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  deleteMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return await httpClient
      .delete(url, {
        headers: {
          ProviderRequest: 'deleteMany',
          ProviderParams: JSON.stringify(params),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },
};
