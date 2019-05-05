import { query as queryUsers, queryCurrent } from '@/services/user';
import { apiQuery, apiQueryById, apiAdd, apiRemove, apiUpdate } from '@/services/api';
var _namespace = 'user';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },


    *fetchList({ payload ,callback}, { call }) {
      console.log('fetchList')
      const response = yield call(apiQuery, _namespace, payload);
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
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
