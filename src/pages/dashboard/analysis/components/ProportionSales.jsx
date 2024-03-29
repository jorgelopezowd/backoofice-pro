import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { Pie } from './Charts';
import Cop from '../utils/Cop';
import styles from '../style.less';

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
  chartTitle
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={chartTitle}
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="all">
              <FormattedMessage id="dashboard-analysis.channel.all" defaultMessage="ALL" />
            </Radio.Button>
            <Radio.Button value="online">
              <FormattedMessage id="dashboard-analysis.channel.online" defaultMessage="Online" />
            </Radio.Button>
            <Radio.Button value="stores">
              <FormattedMessage id="dashboard-analysis.channel.stores" defaultMessage="Stores" />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        <FormattedMessage id="dashboard-analysis.analysis.sales" defaultMessage="Sales" />
      </h4>
      <Pie
        hasLegend
        subTitle={
          <FormattedMessage id="dashboard-analysis.analysis.sales" defaultMessage="Sales" />
        }
        total={() => <Cop>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Cop>}
        data={salesPieData}
        valueFormat={value => <Cop>{value}</Cop>}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSales;
