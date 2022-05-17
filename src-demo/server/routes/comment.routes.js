const express = require('express');
// const User = require('../models/User');
const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
const router = express.Router({ mergeParams: true });
const app = require('../app.js');
const {
  getDoc,
  setDoc,
  query: q,
  where,
  limit,
  doc,
  getDocs,
  collection,
} = require('firebase/firestore');


const resource = 'comments';

router.get('/:id?', [
  auth,
  async (req, res) => {
    try {
      const dataProvider = app.provider;
      const query = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      // Если идет запрос на все документы в коллекции подменяем количество запрашиваемых данных
      if (params.pagination?.perPage < 0) {
        const firestore = app.firestore;
        const usersSnap = await firestore.collection(resource).get();
        params.pagination.perPage = usersSnap.size;
      }

      if (query==='getList' && Array.isArray(params.filter)) {
        const firestore = app.firestore;
        const colRef = collection(firestore, resource);
        let wheres = [];
        let search = null;
        params.filter.forEach((f) => {
          if (f.field !== 'q') {
            wheres.push(where(f.field, f.operator, f.value));
          } else {
            search = unescape(f.value);
          }
        });
        let items = [];
        if (wheres.length > 0) {
          const docRefs = q(colRef, ...wheres);
          const querySnapshot = await getDocs(docRefs);

          querySnapshot.forEach((doc) => {
            items.push(doc.data());
          });
        }

        if (search) {
          const colRef = collection(firestore, resource);
          const querySnapshot = await getDocs(colRef);
          querySnapshot.forEach((doc) => {
            if (items.filter((item) => item.id === doc.id).length === 0) {
              const data = doc.data();
              let isSearch = false;
              Object.keys(data).forEach((key) => {
                if (data[key].toString().search(search) > -1) isSearch = true;
              });
              if (isSearch) items.push(data);
            }
          });
        }

        res.status(200).send(items);
      } else {
        const { data } = await dataProvider[query](resource, params);
        res.status(200).send(data);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        code: 500,
        name: 'ServerError',
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      });
    }
  },
]);

router.put('/:id?', [
  auth,
  async (req, res) => {
    try {
      const dataProvider = app.provider;
      const query = req.body.headers.ProviderRequest;
      const params = JSON.parse(req.body.data);

      const { data } = await dataProvider[query](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        code: 500,
        name: 'ServerError',
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      });
    }
  },
]);

router.post('/', [
  auth,
  async (req, res) => {
    try {
      console.log('route tasks');
      const dataProvider = app.provider;
      const query = req.body.headers.ProviderRequest;
      const params = JSON.parse(req.body.data);

      const { data } = await dataProvider[query](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        code: 500,
        name: 'ServerError',
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      });
    }
  },
]);

router.delete('/:id?', [
  auth,
  async (req, res) => {
    try {
      console.log('route tasks');
      const dataProvider = app.provider;
      const query = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      const { data } = await dataProvider[query](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        code: 500,
        name: 'ServerError',
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      });
    }
  },
]);

module.exports = router;
