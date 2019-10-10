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

  const { Option } = Select;

  const fieldLabels = {
    weight: 'Peso (Kg)',
    dimensions : {
      width: 'Ancho (cm)',
      height: 'Alto (cm)',
      depth: 'Profundidad (cm)',
    }
  };

  interface FormDateType {
    key: string;
    workId?: string;
    name?: string;
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


class ProductShipping extends PureComponent<FormProps,FormState>{

  submitForm = ()=>{
    console.log('submit shipping' )
  }
 
    render(){

        const {
            form: { getFieldDecorator },
            submitting
        } = this.props;

        return  <Card loading={submitting} title="Información de envío" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={<span><Icon type="vertical-align-bottom" /> {fieldLabels.weight}</span>}>
                {getFieldDecorator('weight', {
                  rules: [{ required: true, message: 'Peso obligatorio' }]
                })(<InputNumber min={0} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={<span><Icon type="column-width" /> {fieldLabels.dimensions.width}</span>}>
                {getFieldDecorator('dimensions.width', {
                  rules: [{ required: true, message: `${fieldLabels.dimensions.width} es obligatorio` }],
                })(<InputNumber min={0} max={10000} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={<span><Icon type="column-height" /> {fieldLabels.dimensions.height}</span>}>
                {getFieldDecorator('dimensions.height', {
                  rules: [{ required: true, message: `${fieldLabels.dimensions.height} es obligatorio` }],
                })(
                  <InputNumber min={0} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={<span><Icon type="pic-center" /> {fieldLabels.dimensions.depth}</span>}>
                {getFieldDecorator('dimensions.depth', {
                  rules: [{ required: true, message: `${fieldLabels.dimensions.depth} es obligatorio` }],
                })(
                  <InputNumber min={0} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    }
  }

  export default Form.create<FormProps>()(ProductShipping)