import { Col, Icon, Row, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Cop from '../utils/Cop';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({
  loading,
  visitData,
  totalSales,
  totalRevenue,
  avgSales,
  totalOrders,
  avgDaily,
  totalProductCost,
}) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="dashboard-analysis.analysis.total-sales"
            defaultMessage="Total Sales"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => <Cop>{numeral(totalSales).format('0,0')}</Cop>}
        footer={
          <Field
            label={
              <FormattedMessage
                id="dashboard-analysis.analysis.total-orders"
                defaultMessage="Total orders"
              />
            }
            value={`${numeral(totalOrders).format('0,0')} `}
          />
        }
        contentHeight={70}
      >
        <Trend flag="down">
          <FormattedMessage
            id="dashboard-analysis.analysis.avg-orders"
            defaultMessage="Daily Changes"
          />
          <span className={styles.trendText}>$ {numeral(avgSales).format('0,0')}</span>
        </Trend>
        <Trend flag="down">
          <FormattedMessage
            id="dashboard-analysis.analysis.avg-day-sales"
            defaultMessage="Daily Changes"
          />
          <span className={styles.trendText}>$ {numeral(avgDaily).format('0,0')}</span>
        </Trend>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="dashboard-analysis.analysis.total-sales"
            defaultMessage="Total Sales"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => <Cop>{numeral(totalSales).format('0,0')}</Cop>}
        footer={
          <Field
            label={
              <FormattedMessage
                id="dashboard-analysis.analysis.total-revenue"
                defaultMessage="Total orders"
              />
            }
            value={`$ ${numeral(totalRevenue - totalProductCost).format('0,0')}`}
          />
        }
        contentHeight={70}
      >
        <Trend
          flag="left"
          style={{
            marginRight: 16,
          }}
        >
          <FormattedMessage
            id="dashboard-analysis.analysis.total-others"
            defaultMessage="Weekly Changes"
          />
          <span className={styles.trendText}>
            ${numeral(totalSales - totalRevenue).format('0,0')}
          </span>
        </Trend>
        {/* <Trend
         
          style={{
            marginRight: 16,
          }}
        >
          <FormattedMessage id="dashboard-analysis.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>${numeral(totalRevenue).format('0,0')}</span>
        </Trend> */}
        <Trend
          flag="left"
          style={{
            marginRight: 16,
          }}
        >
          <FormattedMessage
            id="dashboard-analysis.analysis.total-products-sales"
            defaultMessage="Weekly Changes"
          />
          <span className={styles.trendText}>${numeral(totalProductCost).format('0,0')}</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="dashboard-analysis.analysis.visits" defaultMessage="Visits" />}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(0).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="dashboard-analysis.analysis.day-visits"
                defaultMessage="Daily Visits"
              />
            }
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={70}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={
          <FormattedMessage id="dashboard-analysis.analysis.payments" defaultMessage="Payments" />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="dashboard-analysis.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            value="60%"
          />
        }
        contentHeight={70}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          <FormattedMessage
            id="dashboard-analysis.analysis.operational-effect"
            defaultMessage="Operational Effect"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              <FormattedMessage
                id="dashboard-analysis.analysis.week"
                defaultMessage="Weekly Changes"
              />
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              <FormattedMessage
                id="dashboard-analysis.analysis.day"
                defaultMessage="Weekly Changes"
              />
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={70}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
