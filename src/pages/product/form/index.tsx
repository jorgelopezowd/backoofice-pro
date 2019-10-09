import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
  TimePicker,
  Tabs,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import ProductInfo from './components/info';
import ProductStock from './components/stock';
import ProductShipping from './components/shipping';
import ProductPricing from './components/pricing';
import ProductSeo from './components/seo';

import { StickyContainer, Sticky } from 'react-sticky';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const fieldLabels = {
  name: 'Nombre',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

interface FormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
  </Sticky>
);


@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
class ProductForm extends Component<FormProps> {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'formAdvancedForm/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;
    return (
      <>
        <PageHeaderWrapper content="Editor de producto">
          <StickyContainer>   
            <Tabs defaultActiveKey="info" renderTabBar={renderTabBar}>

              <TabPane
                tab={
                  <span>
                    <Icon type="folder" />
                    Información Básica
                  </span>
                }
                key="info"
              >
                {getFieldDecorator('info', {
                initialValue: tableData,
                })(<ProductInfo />)}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <Icon type="code-sandbox" />
                    Inventario
                  </span>
                }
                key="stock"
              >
              {getFieldDecorator('stock', {
                initialValue: tableData,
                })(<ProductStock />)}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <Icon type="rocket" />
                    Transporte
                  </span>
                }
                key="shipping"
              >
                {getFieldDecorator('stock', {
                initialValue: tableData,
                })(<ProductShipping />)}
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <Icon type="dollar" />
                    Precio
                  </span>
                }
                key="pricing"
              >
                {getFieldDecorator('pricing', {
                initialValue: tableData,
                })(<ProductPricing />)}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <Icon type="search" />
                    SEO
                  </span>
                }
                key="seo"
              >
                {getFieldDecorator('seo', {
                initialValue: tableData,
                })(<ProductSeo />)}
              </TabPane>
              
            </Tabs>
          </StickyContainer>

          {/* <Card title="成员管理" bordered={false}>
            {getFieldDecorator('members', {
              initialValue: tableData,
            })(<TableForm />)}
          </Card> */}
          
        </PageHeaderWrapper>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<FormProps>()(ProductForm);
