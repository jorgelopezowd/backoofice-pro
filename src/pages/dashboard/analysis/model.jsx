import { fakeChartData, salesByPayment } from './service';

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  offlineData: [],
  offlineChartData: [],
  salesTypeData: [],
  salesTypeDataOnline: [],
  salesTypeDataOffline: [],
  radarData: [],
  salesByPayment : []
};
const Model = {
  namespace: 'dashboardAnalysis',
  state: initState,
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },

    *fetchSalesByPayment(_, { call, put }) {
      const response = yield call(salesByPayment);
      yield put({
        type: 'byPayment',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    byPayment(state, { payload }) {
      return { ...state, salesByPayment: payload };
    },
    

    clear() {
      return initState;
    },
  },
};
export default Model;
