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
import { StickyContainer, Sticky } from 'react-sticky';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import ProductInfo from './components/info';
import ProductStock from './components/stock';
import ProductShipping from './components/shipping';
import ProductPricing from './components/pricing';
import ProductSeo from './components/seo';
import styles from './style.less';

import defaultSettings from './../../../../config/defaultSettings';

const { langs, langDefault } = defaultSettings;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const fieldLabels = {
  name: 'Nombre',
  type: 'Tipo de producto',
  lang: 'Idioma',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
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
    lang: 'es',
    info: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();

    this.setState(state => ({
      ...state,
      info: langs.map((item: any) => {
        return { lang: item.id };
      }),
    }));
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
    const errorList = Object.keys(errors)
      .map(key => {
        if (!errors[key]) {
          return null;
        }
        const errorMessage = errors[key].title || errors[key][0] || null;
        // console.log('errorMessage',errorMessage,'errors',errors[key],'key', key)
        if (!errorMessage) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errorMessage}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      })
      .filter(item => item !== null);
    console.log('errorList', errorList);
    if (!errorList.length) {
      return null;
    }
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="Errores"
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
      console.log('submit values', values, error);
      if (!error) {
        // submit the values
        dispatch({
          type: 'formAdvancedForm/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  renderTitle = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const productTypes = [
      { id: 'single', label: 'Simple' },
      { id: 'package', label: 'Paquete' },
      { id: 'virtual', label: 'Virtual' },
    ];
    const lang = getFieldValue('lang');

    return (
      <Row gutter={8}>
        <Col xs={24} md={12}>
          {langs.map(itemLang => (
            <Form.Item
              label={fieldLabels.name}
              style={itemLang.id === lang ? {} : { display: 'none' }}
            >
              {getFieldDecorator(`${itemLang.id}.title`, {
                initialValue: null,
                rules: [
                  {
                    required: true,
                    message: `Nombre es obligatorio ${itemLang.label}`,
                  },
                ],
              })(<Input type={itemLang.id === lang ? 'text' : 'hidden'} />)}
            </Form.Item>
          ))}
        </Col>
        <Col xs={12} md={3}>
          <Form.Item label={fieldLabels.lang}>
            {getFieldDecorator('lang', {
              initialValue: langDefault,
            })(
              <Select>
                {langs.map((lang: any) => (
                  <Option value={lang.id}>{lang.label}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xs={12} md={3}>
          <Form.Item label={fieldLabels.type}>
            {getFieldDecorator('type', {
              initialValue: 'single',
            })(
              <Select>
                {productTypes.map((pType: any) => (
                  <Option value={pType.id}>{pType.label}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
    } = this.props;
    const { width, info } = this.state;
    const lang = getFieldValue('lang');
    console.log('lang', lang, info);
    return (
      <>
        <PageHeaderWrapper content={this.renderTitle()}>
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
                {getFieldDecorator(`${lang}.info`, {
                  initialValue: tableData,
                })(<ProductInfo submitting={submitting} />)}
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
                })(<ProductStock submitting={submitting} />)}
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
                })(<ProductShipping submitting={submitting} />)}
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
                })(<ProductPricing submitting={submitting} />)}
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
            Guardar
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<FormProps>()(ProductForm);
