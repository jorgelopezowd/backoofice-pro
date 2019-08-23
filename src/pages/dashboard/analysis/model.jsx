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
  salesByPayment: [],
  salesByDate: [],
  salesAddressState: [],
  salesByCustomers: [],
  salesResume: {},
  facets: {},
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

    *fetchSalesByDate({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });
      yield put({
        type: 'salesByDate',
        payload: response,
      });
    },

    *fetchSalesByPayment({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });

      yield put({
        type: 'byPayment',
        payload: response,
      });
    },

    *fetchSalesByAddressState({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });
      console.log('response address', response);
      yield put({
        type: 'byAddressState',
        payload: response,
      });
    },

    *fetchSalesByCustomers({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });
      console.log('response customer', response);
      yield put({
        type: 'byCustomers',
        payload: response,
      });
    },

    *fetchSalesResume({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });

      yield put({
        type: 'salesResume',
        payload: response[0],
      });
    },

    *fetchFacets({ payload }, { call, put }) {
      const response = yield call(salesByPayment, { query: payload });

      yield put({
        type: 'facets',
        payload: response[0],
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
    salesByDate(state, { payload }) {
      return { ...state, salesByDate: payload };
    },
    byAddressState(state, { payload }) {
      return { ...state, salesAddressState: payload };
    },
    byCustomers(state, { payload }) {
      return { ...state, salesByCustomers: payload };
    },
    salesResume(state, { payload }) {
      return { ...state, salesResume: payload };
    },
    facets(state, { payload }) {
      return { ...state, facets: payload };
    },

    clear() {
      return initState;
    },
  },
};
export default Model;
