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
  Badge,
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
  lang: 'Idioma'
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

  constructor(props) {
    super(props);
    this.shippingForm = React.createRef();
    this.pricingForm = React.createRef();
  }


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

  getErrors = (full = true) => {
    const {
      form: { getFieldsError },
    } = this.props;
    let errors = getFieldsError();
    if(this.shippingForm.current){
      errors = {...errors,...this.shippingForm.current.getFieldsError()}
    }
    if(this.pricingForm.current){
      const pricing = this.pricingForm.current.getFieldsError()
      Object.keys(pricing).forEach(key => {
        Object.keys(pricing[key]).forEach(key2 => {
          if(pricing[key][key2]){
            errors = {...errors,[`${key}-${key2}`]:pricing[key][key2],pricing:true}
          }

        })

      })
      console.log('error pricing',pricing,'error',errors)
    }
    
    
    if (!errors) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    errors = {
      ...errors,
      ...errors.dimensions
    }
    if(errors.dimensions){
      Object.keys(errors.dimensions).forEach(key => {
        if(errors.dimensions[key]){
          errors.shipping = true
        }
      })

    }
    

    if(!full){
      return errors
    }
    
    
    const errorList = Object.keys(errors)
      .map(key => {
        if (!errors[key]) {
          return null;
        }
        const errorMessage = errors[key].title || errors[key][0] || null;
        console.log('errors Message',errors[key], key)
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
    // console.log('errorList', errorList);
    return errorList
    // if (!errorList.length) {
    //   return null;
    // }
  }

  getErrorInfo = () => {
    
    const errorList = this.getErrors()
    if(!errorList.length){
      return null
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
        {errorList.length}
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

  validate = async () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    
    const shipping = await this.shippingForm.current.validateFields().catch(e=>console.log('error',e))
    const pricing = await this.pricingForm.current.validateFields().catch(e=>console.log('error pricing',e))
    // console.log('shipping',shipping)
    validateFieldsAndScroll((error, values) => {
      console.log('submit values', values, error);
      if (!error && shipping && pricing) {
        // submit the values
        dispatch({
          type: 'formAdvancedForm/submitAdvancedForm',
          payload: {
            ...values,
            shipping},
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
    const { width } = this.state;
    const lang = getFieldValue('lang');
    const errorsList = this.getErrors(false)
    console.log('errorList', errorsList);
    return (
      <>
        <PageHeaderWrapper content={this.renderTitle()}>
          <StickyContainer>
            <Tabs defaultActiveKey="pricing" renderTabBar={renderTabBar}>
              <TabPane
                forceRender
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
                forceRender
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
                forceRender
                tab={
                    <Badge dot={errorsList.shipping}>
                  <span>
                      <Icon type="rocket" />
                    Transporte y envío
                  </span>
                      </Badge>
                }
                key="shipping"
              >
                {getFieldDecorator('shipping', {
                  initialValue: {},
                })(<ProductShipping ref={this.shippingForm} submitting={submitting} />)}
              </TabPane>

              <TabPane
                forceRender
                tab={
                  <Badge dot={errorsList.pricing}>
                    <span>
                      <Icon type="dollar" />
                      Precios
                    </span>
                  </Badge>
                }
                key="pricing"
              >
                {getFieldDecorator('pricing', {
                  initialValue: tableData,
                })(<ProductPricing ref={this.pricingForm} submitting={submitting} />)}
              </TabPane>

              <TabPane
                forceRender
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

export default Form.create<FormProps>({ withRef: true })(ProductForm);
