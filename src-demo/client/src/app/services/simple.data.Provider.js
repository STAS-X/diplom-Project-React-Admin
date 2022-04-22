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
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return new Promise((resolve, reject) => {
      httpClient.get(url, { queryType: 'getList' }).then(
        ({ status, headers, body }) => {
          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            // not json, no big deal
          }
          if (status < 200 || status >= 300) {
            return reject({
              status,
              body: { message: (json && json.message) || statusText },
              data: json,
            });
          }
          return resolve({
            status,
            headers,
            body,
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
          });
        }
      );
    });
  },

  getOne: (resource, params) =>
    new Promise((resolve, reject) => {
      httpClient.get(`${apiUrl}/${resource}/${params.id}`, {
        queryType: 'getOne',
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            body: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: json,
        });
      });
    }),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return new Promise((resolve, reject) => {
      httpClient.get(url, { queryType: 'getMany' }).then(
        ({ status, headers, body }) => {
          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            // not json, no big deal
          }
          if (status < 200 || status >= 300) {
            return reject({
              status,
              error: { message: (json && json.message) || statusText },
              data: json,
            });
          }
          return resolve({
            status,
            headers,
            body,
            data: json,
          });
        }
      );
    });
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return new Promise((resolve, reject) => {
      httpClient.get(url, { queryType: 'getManyReference' }).then(
        ({ status, headers, body }) => {
          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            // not json, no big deal
          }
          if (status < 200 || status >= 300) {
            return reject({
              status,
              error: { message: (json && json.message) || statusText },
              data: json,
            });
          }
          return resolve({
            status,
            headers,
            body,
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
          });
        }
      );
    });
  },

  update: (resource, params) =>
    new Promise((resolve, reject) => {
      httpClient.put(`${apiUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        queryType: 'update',
        body: JSON.stringify(params.data),
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            error: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: json,
        });
      });
    }),

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return new Promise((resolve, reject) => {
      httpClient.put(`${apiUrl}/${resource}?${stringify(query)}`, {
        method: 'PUT',
        queryType: 'updateMany',
        body: JSON.stringify(params.data),
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            error: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: json,
        });
      });
    });
  },

  create: (resource, params) =>
    new Promise((resolve, reject) => {
      httpClient.post(`${apiUrl}/${resource}`, {
        method: 'POST',
        queryType: 'create',
        body: JSON.stringify(params.data),
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            error: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: { ...params.data, id: json.id },
        });
      });
    }),

  delete: (resource, params) =>
    new Promise((resolve, reject) => {
      httpClient.delete(`${apiUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
        queryType: 'delete',
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            error: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: json,
        });
      });
    }),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return new Promise((resolve, reject) => {
      httpClient.delete(`${apiUrl}/${resource}?${stringify(query)}`, {
        method: 'DELETE',
        queryType: 'deleteMany',
        body: JSON.stringify(params.data),
      }).then(({ status, headers, body }) => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // not json, no big deal
        }
        if (status < 200 || status >= 300) {
          return reject({
            status,
            error: { message: (json && json.message) || statusText },
            data: json,
          });
        }
        return resolve({
          status,
          headers,
          body,
          data: json,
        });
      });
    });
  },
};
