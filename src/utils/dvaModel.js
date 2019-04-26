import { apiQuery, apiQueryById, apiAdd, apiRemove, apiUpdate } from '@/services/api';
import { Model } from 'dva';
var namespace = '';
const dvaModel = Model({})
//  {
//   namespace: getNamespace(),
//   state: {
//     data: {
//       list: [],
//       pagination: {},
//     },
//   },

//   effects: {

//     *fetch({ payload }, { call, put }) {
//       console.log('namespace:'+dvaModel.namespace)
//       const response = yield call(apiQuery, dvaModel.namespace, payload);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//     },
//     *add({ payload, callback }, { call }) {
//       const response = yield call(apiAdd,  dvaModel.namespace, payload);
//       if (callback) callback(response);
//     },
//     *remove({ payload, callback }, { call }) {
//       const response = yield call(apiRemove,  dvaModel.namespace, payload);
//       if (callback) callback(response);
//     },
//     *update({ payload, callback }, { call }) {
//       const response = yield call(apiUpdate, dvaModel.namespace, payload);
//       if (callback) callback(response);
//     },
//   },

//   reducers: {
//     save(state, action) {
//       return {
//         ...state,
//         data: action.payload,
//       };
//     },
//   },
// };
export default dvaModel;