import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import appConfig from '../config/default.json';
import { getHook } from 'react-hooks-outside';
import httpService from './http.service';

const apiUrl = appConfig.isFireBase
  ? process.env.NODE_ENV === 'production'
    ? appConfig.apiDataEndpointProd
    : appConfig.apiDataEndpoint
  : appConfig.apiEndpoint;
const httpClient = httpService;

const verifyLoggedStatus = () => {
  const { getState } = getHook('store');
  return getState().authContext.isLoggedIn;
};

export default {
  getList: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    if (!verifyLoggedStatus())
      return new Promise((resolve) => resolve({ data: [], total: 0 }));

    const filter = params.filter;
    const operators = {
      _gte: '>=',
      _lte: '<=',
      _neq: '!=',
      _arr: 'array-contains',
    };
    // filters is like [
    //    { field: "commentable", operator: "=", value: true},
    //    { field: "released", operator: ">=", value: '2018-01-01'}
    // ]
    const filters = [];
    Object.keys(filter).forEach((key) => {
      if (typeof filter[key] === 'object') {
        const innerFilter = filter[key];
        Object.keys(innerFilter).forEach((innerKey) => {
          const operator = operators[innerKey.slice(-4)];
          filters.push(
            operator
              ? {
                  field: innerKey.slice(0, -4),
                  operator,
                  value: innerFilter[innerKey],
                }
              : {
                  field: innerKey,
                  operator: '==',
                  value:
                    innerKey === 'q'
                      ? escape(innerFilter[innerKey])
                      : innerFilter[innerKey],
                }
          );
        });
      } else {
        const operator = operators[key.slice(-4)];
        filters.push(
          operator
            ? { field: key.slice(0, -4), operator, value: filter[key] }
            : {
                field: key,
                operator: '==',
                value: key === 'q' ? escape(filter[key]) : filter[key],
              }
        );
      }
    });
    console.log(filters, 'get filters');

    return httpClient
      .get(url, {
        headers: {
          ProviderRequest: 'getList',
          ProviderParams: JSON.stringify({
            ...params,
            filter: filters.length > 0 ? filters : filter,
          }),
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
      })
      .catch((err) => console.log(err));
  },

  getOne: (resource, params) => {
    console.log(params, 'params id for getOne');
    const url = `${apiUrl}/${resource}/${params.id}`;

    return httpClient
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

  getMany: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    console.log(resource, params, 'getMany');
    return httpClient
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

  getManyReference: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
        console.log(resource, params, 'getManyRefs');
    return httpClient
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

  update: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient
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

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient
      .put(url, {
        data: JSON.stringify(params.ids),
        headers: {
          ProviderRequest: 'updateMany',
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return data;
      });
  },

  create: (resource, params) => {
    const url = `${apiUrl}/${resource}`;

    return httpClient
      .post(url, {
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

  delete: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient
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

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    console.log(params, 'ids to delete');
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient
      .delete(url, {
        headers: {
          ProviderRequest: 'deleteMany',
          ProviderParams: JSON.stringify(params.ids),
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return { data };
      });
  },
};
