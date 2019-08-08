import { Col, Dropdown, Icon, Menu, Row, DatePicker, Card, Button } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

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
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('month'),
  };

  reqRef = 0;

  timeoutId = 0;

  componentDidMount(){
    this.submitCharts()
  }

  submitCharts = ()=>  {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state
    this.reqRef = requestAnimationFrame(() => {
      const date_start = moment(rangePickerValue[0]).format('YYYY-MM-DD')
      const date_end = moment(rangePickerValue[1]).format('YYYY-MM-DD')
      // console.log('date start end',date_start,date_end)
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });

      let $group = { 
        _id: null,
        totalPaid : {$sum : '$total_paid'},
        totalRevenue : {$sum : '$total_revenue'},
        avgSales : {$avg : '$total_paid'},
        totalOrders : {$sum : 1}
      }
      
      let $match = {
        validRevenue : true,
        // payment : 'PSE'
      }
      
      dispatch({
        type: 'dashboardAnalysis/fetchSalesResume',
        payload : {
          date_add : {
            min : date_start,
            max : date_end
          },
          $group,
          $match,
          $sort : {totalPaid : -1},
        }
      });
      
      $group = { 
        _id: '$payment',
        totalPaid : {$sum : '$total_paid'},
        totalRevenue : {$sum : '$total_revenue'},
        avgPaid : {$avg : '$total_paid'},
        count : {$sum : 1}
      }


      dispatch({
        type: 'dashboardAnalysis/fetchSalesByPayment',
        payload : {
          date_add : {
            min : date_start,
            max : date_end
          },
          $group,
          $match,
          $sort : {totalPaid : -1},
        }
      });

      $group = { _id: { $dateToString: { 

        format: "%Y-%m-%d", 
        date: "$date_add" ,
        // timezone: "-05:00",
        // onNull:"unspecified",
        } 
      },
        totalPaid : {$sum : '$total_paid'},
        avgPaid : {$avg : '$total_paid'},
        count : {$sum : 1}
      }

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByDate',
        payload : {
          $group,
          date_add : {
            min : date_start,
            max : date_end  
          },
          $sort : {_id : 1},
          $match

          
        }
      });
      
      $group = { 
        _id: '$invoiceAddress.state',
        totalPaid : {$sum : '$total_paid'},
        avgPaid : {$avg : '$total_paid'},
        count : {$sum : 1}
      }

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByAddressState',
        payload : {
          $group,
          date_add : {
            min : date_start,
            max : date_end
          },
          $match,
          $sort : {totalPaid : -1}
          
        }
      });

      $group = { _id: '$customer.customerId',
            totalPaid : {$sum : '$total_paid'},
            avgPaid : {$avg : '$total_paid'},
            count : {$sum : 1},
            customer : {"$first": "$customer"},
            region : {"$first": "$invoiceAddress"},
        }

      dispatch({
        type: 'dashboardAnalysis/fetchSalesByCustomers',
        payload : {
          $group,
          date_add : {
            min : date_start,
            max : date_end
          },
          $match,
          $sort : {totalPaid : -1},
          $limit : 10
          
        }
      });


    });
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
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    
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

  handleChangeDateRange = (value, dateString) =>{

  }

  filterBydate = () =>{
    this.submitCharts()
  }

  disabledDate = (current)=> {
    // Can not select days before today and today
    return false;
    // return current && current > moment().endOf('day');
  }

  avgSales = (total, date_start, date_end) =>{
    const days = date_end.diff(date_start, 'days') + 1
    return total/days
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { dashboardAnalysis, loading } = this.props;
    const {
      visitData,
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
      salesResume
    } = dashboardAnalysis;
    let salesPieData;
    // console.log('salesByPayment',salesByDate)

    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    salesPieData = salesByPayment.map(item => {return {x:item._id,y:item.totalPaid}})
    const salesPieAddressState = salesAddressState.map(item => {return {x:item._id,y:item.totalPaid}})
    // const totalSales = salesByPayment.reduce((a,b)=>a + b.totalPaid,0)
    // const totalRevenue = salesByPayment.reduce((a,b)=>a + b.totalRevenue,0)
    const {totalRevenue, avgSales, totalPaid, totalOrders} = salesResume
  
    const salesByDateXY = salesByDate.map(item => {return {x:item._id, y:item.totalPaid}})
  
    console.log('ranking customer',salesByCustomers)
    console.log('resumesales', salesResume)
    const rankingCustomers = salesByCustomers.map(item => {
      const {customer : {customerId, firstName, lastName} , region : {city, state, country}, totalPaid} = item
      return {
        customerId,
        firstName,
        lastName,
        state,
        city,
        country,
        totalPaid
      }
    })
    
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
    console.log('rangePickerValue',rangePickerValue)
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>
          <Row>
            <Col>
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
                format={dateFormat}
                disabledDate={this.disabledDate}
                allowClear={false}
              />
              <Button type="primary" icon="search"
                onClick={this.filterBydate}
              >
                Filtrar
              </Button>

            </Card>
            </Col>
          </Row>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={visitData} totalSales={totalPaid} 
            totalRevenue={totalRevenue}
            // avgSales={this.avgSales(totalSales,rangePickerValue[0],rangePickerValue[1])}
            avgSales={avgSales}
            totalOrders={totalOrders}
            />

          </Suspense>
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
                  chartTitle={<FormattedMessage
                    id="dashboard-analysis.analysis.sales-by-address-state"
                    defaultMessage="Sales by state"
                  />}
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
                  chartTitle={<FormattedMessage
                    id="dashboard-analysis.analysis.the-proportion-of-sales"
                    defaultMessage="Sales by payment"
                  />}
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
