import { Col, Dropdown, Icon, Menu, Row, DatePicker, Card, Button, Select, Divider,Statistic } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

@connect(({ dashboardAnalysis, loading }) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetchFacets'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('month'),
    filter: {},
    totalHits : 0 ,
    isSignedIn: false,
    visitData : []
  };

  reqRef = 0;

  timeoutId = 0;

  componentDidMount() {
    this.submitCharts();
    const $this = this
    const script = document.createElement("script");

    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.onload = ()=>{
      function start() {
        gapi.client.init({
          'apiKey': 'AIzaSyBTJvGEuT7NIY9bvqLJqtnC7ptCMkctZuc',
          // Your API key will be automatically added to the Discovery Document URLs.
          'discoveryDocs': ['https://analyticsreporting.googleapis.com/$discovery/rest'],
          // clientId and scope are optional if auth is not required.
          'clientId': '361178504661-a486jgeilbrdveqpflvijvki034idt9t.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/analytics',
        }).then(function(data) {
          console.log('gapi data',data)
         
          gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
            // console.log('isSignedIn >> ',isSignedIn)
            $this.updateSigninStatus(isSignedIn)
          });

          // Handle the initial sign-in state.
          $this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        }).then(function(response) {
          // console.log('gapi response',response);
        }, function(reason) {
          console.log('Error gapi: ' , reason);
        }).catch(err => console.log('gapi error >> ',err));
      };
      // 1. Load the JavaScript client library.
      gapi.load('client', start);
    }

    document.body.appendChild(script);
  }

  loginGoogle = ()=>{
    gapi.auth2.getAuthInstance().signIn();
  }

  logOutGoogle = ()=>{
    gapi.auth2.getAuthInstance().signOut();
  }

  updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
          // authorizeButton.style.display = 'none';
          // signoutButton.style.display = 'block';
          const {rangePickerValue} = this.state
          // console.log('gapi isSignedIn',isSignedIn)

          const date_start = moment(rangePickerValue[0]).format('YYYY-MM-DD');
          const date_end = moment(rangePickerValue[1]).format('YYYY-MM-DD');
          this.setState(state => ({...state,isSignedIn}))
          const reportParams = {
            "reportRequests":[
            {
              "viewId":"94609974",
              "dateRanges":[
                {
                  "startDate":date_start,
                  "endDate": date_end
                }],
              "metrics":[
                {
                  "expression":"ga:hits"
                }],
              "dimensions": [
                {
                  "name":"ga:date"
                }]
            }]
          }
          console.log('gapi reportParams',reportParams)
          gapi.client.analyticsreporting.reports.batchGet(reportParams )
            .execute(data => {
              console.log('data_ gapi >',data, data.reports[0].data.totals[0].values[0])
              const totalHits = data.reports[0].data.totals[0].values[0]
              const visitData = data.reports[0].data.rows.map(item => {
                return {x:moment(item.dimensions[0]).format('YYYY-MM-DD'),y:parseInt(item.metrics[0].values[0])}
                })
              this.setState(state => ({...state, totalHits, visitData}))


            })
          // makeApiCall();
        } else {
          // authorizeButton.style.display = 'block';
          // signoutButton.style.display = 'none';
          // console.log('gapi isSignedIn no',isSignedIn)
        }
      }

  submitCharts = () => {
    const { dispatch } = this.props;
    const { rangePickerValue, filter } = this.state;
    this.reqRef = requestAnimationFrame(() => {
      const date_start = moment(rangePickerValue[0]).format('YYYY-MM-DD');
      const date_end = moment(rangePickerValue[1]).format('YYYY-MM-DD');
      // console.log('date start end',date_start,date_end)
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });

      let $group = {
        _id: null,
        totalPaid: { $sum: '$total_paid' },
        totalRevenue: { $sum: '$total_revenue' },
        totalProductCost: { $sum: '$total_product_cost' },
        avgSales: { $avg: '$total_paid' },
        totalOrders: { $sum: 1 },
      };

      let $match = {
        validRevenue: true,
        ...filter,
        // payment : 'PSE'
      };

      dispatch({
        type: 'dashboardAnalysis/fetchSalesResume',
        payload: {
          date_add: {
            min: date_start,
            max: date_end,
          },
          $group,
          $match,
          $sort: { totalPaid: -1 },
        },
      });

      $group = {
        _id: '$payment',
        totalPaid: { $sum: '$total_paid' },
        totalRevenue: { $sum: '$total_revenue' },
        avgPaid: { $avg: '$total_paid' },
        count: { $sum: 1 },
      };

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByPayment',
        payload: {
          date_add: {
            min: date_start,
            max: date_end,
          },
          $group,
          $match,
          $sort: { totalPaid: -1 },
        },
      });

      $group = {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$date_add',
            // timezone: "-05:00",
            // onNull:"unspecified",
          },
        },
        totalPaid: { $sum: '$total_paid' },
        avgPaid: { $avg: '$total_paid' },
        count: { $sum: 1 },
      };

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByDate',
        payload: {
          $group,
          date_add: {
            min: date_start,
            max: date_end,
          },
          $sort: { _id: 1 },
          $match,
        },
      });

      $group = {
        _id: '$invoiceAddress.state',
        totalPaid: { $sum: '$total_paid' },
        avgPaid: { $avg: '$total_paid' },
        count: { $sum: 1 },
      };

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByAddressState',
        payload: {
          $group,
          date_add: {
            min: date_start,
            max: date_end,
          },
          $match,
          $sort: { totalPaid: -1 },
        },
      });

      $group = {
        _id: '$customer.customerId',
        totalPaid: { $sum: '$total_paid' },
        avgPaid: { $avg: '$total_paid' },
        count: { $sum: 1 },
        customer: { $first: '$customer' },
        region: { $first: '$invoiceAddress' },
      };

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByCustomers',
        payload: {
          $group,
          date_add: {
            min: date_start,
            max: date_end,
          },
          $match,
          $sort: { totalPaid: -1 },
          $limit: 10,
        },
      });

      $group = {
        _id: '$ordered',
        totalCart: { $sum: '$total_cart' },
        avgCart: { $avg: '$total_cart' },
        avgCount : {$avg : {$sum : 1}},
        count: { $sum: 1 },
      };

      dispatch({
        type: 'dashboardAnalysis/fetchCartStats',
        payload: {
          $group,
          date_add: {
            min: date_start,
            max: date_end,
          },
          $match : {},
          $sort: { totalPaid: -1 },
        },
      });

      $group = {
        _id : null,
        totalPaid: { $sum: '$total_paid' },
        totalRevenue: { $sum: '$total_revenue' },
        totalProductCost: { $sum: '$total_product_cost' },
        avgSales: { $avg: '$total_paid' },
        totalOrders: { $sum: 1 },
      };

      
      dispatch({
        type: 'dashboardAnalysis/fetchMonthStats',
        payload: {
          $group,
          date_add: {
            min: moment().startOf('month').format('YYYY-MM-DD'),
            max: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          },
          $match,
          $sort: { totalPaid: -1 },
        },
      });

      $group = {
        _id : null,
        totalPaid: { $sum: '$total_paid' },
        totalRevenue: { $sum: '$total_revenue' },
        totalProductCost: { $sum: '$total_product_cost' },
        avgSales: { $avg: '$total_paid' },
        totalOrders: { $sum: 1 },
      };

      
      dispatch({
        type: 'dashboardAnalysis/fetchLastMonthStats',
        payload: {
          $group,
          date_add: {
            min: moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
            max: moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'),
          },
          $match,
          $sort: { totalPaid: -1 },
        },
      });

      const $facet = {
        countries: [{ $sortByCount: '$invoiceAddress.country' }],
        cities: [{ $sortByCount: '$invoiceAddress.city' }],
        states: [{ $sortByCount: '$invoiceAddress.state' }],
      };

      dispatch({
        type: 'dashboardAnalysis/fetchFacets',
        payload: {
          date_add: {
            min: date_start,
            max: date_end,
          },
          $match,
          $facet,
        },
      });
    });
    if(window.gapi){
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    // dispatch({
    //   type: 'dashboardAnalysis/fetchSalesData',
    // });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState(
      {
        rangePickerValue: getTimeDistance(type),
      },
      this.submitCharts,
    );
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  handleChangeDateRange = (value, dateString) => {};

  filterBydate = () => {
    this.submitCharts();
  };

  disabledDate = current => {
    // Can not select days before today and today
    // return false;
    return current && current > moment().endOf('day');
  };

  avgSales = (total, date_start, date_end) => {
    const days = date_end.diff(date_start, 'days') + 1;
    return total / days;
  };

  filterByFacet = (value, facet) => {
    const { filter } = this.state;
    if (value !== '') {
      filter[facet] = value;
    } else {
      delete filter[facet];
    }
    this.setState(state => ({ ...state, filter }), this.submitCharts);
  };


  funnelOptions = (data)=>{
    return {
    title: {
        text: 'Conversión',
        subtext: 'Embudo'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    toolbox: {
        
    },
    legend: {
        data: data.map(item => item.name)
    },
    calculable: false,
    series: [
      {
        name: '预期',
        type: 'funnel',
        left: '10%',
        width: '80%',
        label: {
            normal: {
                formatter: '{b}预期'
            },
            emphasis: {
                position:'inside',
                formatter: '{b}预期: {c}%'
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                opacity: 0.7
            }
        },
        data : [ 
          {value: 100, name: 'Visitas'},
          {value: 80, name: 'Carritos'},
          {value: 60, name: 'Carritos con pedido'},
          {value: 10, name: 'Ventas'}
        ]
    },
        {
            name:'Conversión de ventas',
            type:'funnel',
            // left: '0%',
            top: 60,
            //x2: 80,
            bottom: 20,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            // max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                show: true,
                position: 'inside'
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20
                }
            },
            data
        },
        
    ]
};

  }

  render() {
    const { rangePickerValue, salesType, currentTabKey,isSignedIn,totalHits, visitData } = this.state;
    const { dashboardAnalysis, loading } = this.props;
    const {
      // visitData,z
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
      salesByPayment,
      salesByDate,
      salesAddressState,
      salesByCustomers,
      salesResume,
      facets,
      cartData,
      monthStats,
      lastMonthStats
    } = dashboardAnalysis;
    let salesPieData;
    // console.log('cartData',cartData)

    // const visitData = []
    // console.log('isSignedIn>>',isSignedIn,'visitData',visitData)

    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    salesPieData = salesByPayment.map(item => {
      return { x: item._id, y: item.totalPaid };
    });
    const salesPieAddressState = salesAddressState.map(item => {
      return { x: item._id, y: item.totalPaid };
    });
    // const totalSales = salesByPayment.reduce((a,b)=>a + b.totalPaid,0)
    // const totalRevenue = salesByPayment.reduce((a,b)=>a + b.totalRevenue,0)
    const { totalRevenue = 0, avgSales = 0, totalPaid= 0, totalOrders = 0 , totalProductCost = 0 } = salesResume || {};

    const salesByDateXY = salesByDate.map(item => {
      return { x: item._id, y: item.totalPaid };
    });

    const carts = cartData.find(item => !item._id) || {count : 0}
    const cartsOrdered = cartData.find(item => item._id) || {count : 0}
    // let funnelData =[
    //     {value: totalHits, name: 'Visitas'},
    //     {value: carts.count+cartsOrdered.count, name: 'Carritos'},
    //     {value: cartsOrdered.count, name: 'Carritos con pedido'},
    //     {value: totalOrders, name: 'Ventas'},
    //     // {value: 100000*100, name: 'Visitas'}
    // ]
    // console.log('cart',funnelData, carts)

    // console.log('ranking customer',salesByCustomers)
    // console.log('facets', facets)
    const rankingCustomers = salesByCustomers.map(item => {
      const {
        customer: { customerId, firstName, lastName },
        region: { city, state, country },
        totalPaid,
      } = item;
      return {
        customerId,
        firstName,
        lastName,
        state,
        city,
        country,
        totalPaid,
      };
    });
console.log('monthStats',monthStats, lastMonthStats)
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );
    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );
    console.log('rangePickerValue', rangePickerValue);
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>
          <Row>
            <Col xs={24}>
              <Card>
                <div className={styles.salesExtra}>
                  <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-day"
                      defaultMessage="All Day"
                    />
                  </a>
                  <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-week"
                      defaultMessage="All Week"
                    />
                  </a>
                  <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-month"
                      defaultMessage="All Month"
                    />
                  </a>
                  <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-year"
                      defaultMessage="All Year"
                    />
                  </a>
                </div>

                <RangePicker
                  onChange={this.handleRangePickerChange}
                  defaultValue={rangePickerValue}
                  value={rangePickerValue}
                  format={dateFormat}
                  disabledDate={this.disabledDate}
                  allowClear={false}
                />

                <Divider type="vertical" />
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="País"
                  optionFilterProp="children"
                  onChange={value => this.filterByFacet(value, 'invoiceAddress.country')}
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Todos</Option>
                  {facets.countries
                    ? facets.countries.map(item => <Option value={item._id}>{item._id}</Option>)
                    : null}
                </Select>
                <Divider type="vertical" />
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Departamento"
                  optionFilterProp="children"
                  onChange={value => this.filterByFacet(value, 'invoiceAddress.state')}
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Todos</Option>
                  {facets.states
                    ? facets.states.map(item => <Option value={item._id}>{item._id}</Option>)
                    : null}
                </Select>
                <Divider type="vertical" />
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Ciudad"
                  optionFilterProp="children"
                  onChange={value => this.filterByFacet(value, 'invoiceAddress.city')}
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Todos</Option>
                  {facets.cities
                    ? facets.cities.map(item => <Option value={item._id}>{item._id}</Option>)
                    : null}
                </Select>
                <Divider type="vertical" />

                <Button type="primary" icon="search" onClick={this.filterBydate}>
                  Filtrar
                </Button>
              </Card>
            </Col>
          </Row>
          <Divider />
          
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow
              loading={loading}
              visitData={visitData}
              totalVisits={totalHits}
              totalSales={totalPaid}
              totalRevenue={totalRevenue}
              avgDaily={this.avgSales(totalPaid, rangePickerValue[0], rangePickerValue[1])}
              avgSales={avgSales}
              totalOrders={totalOrders}
              totalProductCost={totalProductCost}
              monthStats={monthStats}
              lastMonthStats={lastMonthStats}
            />
          </Suspense>
          <Row>
            {/* <Col xs={24}>
              <ReactEcharts 
                option={this.funnelOptions(funnelData)}
                lazyUpdate={true}
                style={{height: '400px', width: '100%'}}
                
              /> 
            </Col> */}
            {!isSignedIn && 
            <Col>
            <Button onClick={this.loginGoogle} type="primary" >
              <Icon type="google" />
              Ingresar a Google Analytics
            </Button>
            </Col>}
            {isSignedIn && 
            <Col>
            <Button onClick={this.logOutGoogle} type='dashed' >
              <Icon type="google" />
              Salir
            </Button>
            </Col>}
            <Col xs={24} hidden={loading}>
           
              <div className={styles.funnel}>
                <div className={`${styles.block} ${styles.block1}`}>
                  <span>
                    <Statistic title="Visitas" value={totalHits} prefix={<Icon type="global" />} />
                  </span>
                </div>
                <div className={`${styles.block} ${styles.block2}`}>
                  <span>
                    <Statistic title="Carritos" value={carts.count+cartsOrdered.count} prefix={<Icon type="shopping-cart" />} />
                  </span>
                </div>
                <div className={`${styles.block} ${styles.block3}`}>
                  <span>
                    <Statistic title="Pedidos" value={cartsOrdered.count} prefix={<Icon type="code-sandbox" />} />
                  </span>
                </div>
                <div className={`${styles.block} ${styles.block4}`}>
                  <span>
                    <Statistic title="Ventas" value={totalOrders} prefix={<Icon type="dollar" />} />
                  </span>
                </div>
              
              </div>
            
            </Col>
          </Row>
          <Suspense fallback={null}>
            <SalesCard
              rangePickerValue={rangePickerValue}
              salesData={salesByDateXY}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
              rankingCustomers={rankingCustomers}
            />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          >
            {/* <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col> */}
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  chartTitle={
                    <FormattedMessage
                      id="dashboard-analysis.analysis.sales-by-address-state"
                      defaultMessage="Sales by state"
                    />
                  }
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieAddressState}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  chartTitle={
                    <FormattedMessage
                      id="dashboard-analysis.analysis.the-proportion-of-sales"
                      defaultMessage="Sales by payment"
                    />
                  }
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
          {/* <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense> */}
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
