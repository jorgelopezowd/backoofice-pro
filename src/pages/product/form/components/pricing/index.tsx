import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Icon,
    InputNumber,
    Popover,
    Row,
    Select,
    TimePicker,
    Tabs,
  } from 'antd';
  import React, { PureComponent } from 'react';
  import { FormComponentProps } from 'antd/es/form';
  
  import styles from './../../style.less';

  import defaultSettings from './../../../../../../config/defaultSettings';

  const { currencies, currencyDefault } = defaultSettings;

  const { Option } = Select;

  const taxDefault = 'na'
  const taxes = [
    {id : 'na', tax : 0, label : 'Sin impuesto'},
    {id : 'co', tax : 19.0, label : '19% Colombia'},
  ]

  const fieldLabels = {
    price: 'Precio de venta (sin IVA)',
    wholesale: 'Costo producción',
    tax : 'Impuesto'
   
  };

  interface FormDateType {
    key: string;
    workId?: string;
    price?: string;
    department?: string;
    isNew?: boolean;
    editable?: boolean;
  }


  interface FormProps {
    loading?: boolean;
    value?: FormDateType[];
    onChange?: (value: FormDateType[]) => void;
  }
  
  interface FormState {
    loading?: boolean;
    value?: FormDateType[];
    data?: FormDateType[];
  }


interface FormProps extends FormComponentProps {
    submitting: boolean;
}


class ProductInfo extends PureComponent<FormProps,FormState>{

    render(){

        const {
            form: { getFieldDecorator }
        } = this.props;

        return  <Card title="Precios" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          {currencies.map(currency => 
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={`${fieldLabels.price} ${currency.id}`}>
                  {getFieldDecorator(`price.${currency.id}`, {
                    rules: [{ required: true, message: `${fieldLabels.price} ${currency.id} es obligatorio` }],
                  })(<InputNumber style={{width:'100%'}} min={0} placeholder="0"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}  
                  />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.tax}>
                  {getFieldDecorator(`tax.${currency.id}`, {
                    rules: [{ required: true, message: `${fieldLabels.tax} ${currency.id} es obligatorio` }],
                    initialValue : taxDefault
                  })(<Select>
                    {taxes.map(item => <Option value={item.id} >{item.label}</Option>)}
                  </Select>)}
                </Form.Item>
              </Col>
              
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.wholesale}>
                  {getFieldDecorator(`wholesale.${currency.id}`, {
                    rules: [{ required: true, message: `${fieldLabels.wholesale} ${currency.id} es obligatorio` }],
                  })(<InputNumber style={{width:'100%'}} min={0} placeholder="0"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}  
                  />)}
                </Form.Item>
              </Col>
            
            </Row>
          )}

          <Row gutter={16}>
            
           
          </Row>
        </Form>
      </Card>
    }
  }

  export default Form.create<FormProps>()(ProductInfo)