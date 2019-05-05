

import { apiQuery, apiQueryById, apiAdd, apiRemove, apiUpdate } from '@/services/api';
var _namespace = 'userRole';

export default {
  namespace: 'userRole',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    machineryData: {}
  },

  effects: {

    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(apiQuery, _namespace, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response'+response)
      if (callback) callback(response);
    },
    *fetchId({ payload, callback }, { call }) {
      const response = yield call(apiQueryById, _namespace, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(apiAdd, _namespace, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(apiRemove, _namespace, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(apiUpdate, _namespace, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};




