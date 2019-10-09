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
  import React, { PureComponent } from 'react';
  import { FormComponentProps } from 'antd/es/form';
  
  import styles from './../../style.less';

  const { Option } = Select;

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


class ProductInfo extends PureComponent<FormProps,FormState>{

    render(){

        const {
            form: { getFieldDecorator }
        } = this.props;

        return  <Card title="Información comercial" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入仓库名称' }],
                })(<Input placeholder="请输入仓库名称" />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.url}>
                {getFieldDecorator('url', {
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="请输入"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.owner}>
                {getFieldDecorator('owner', {
                  rules: [{ required: true, message: '请选择管理员' }],
                })(
                  <Select placeholder="请选择管理员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.approver}>
                {getFieldDecorator('approver', {
                  rules: [{ required: true, message: '请选择审批员' }],
                })(
                  <Select placeholder="请选择审批员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.type}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择仓库类型' }],
                })(
                  <Select placeholder="请选择仓库类型">
                    <Option value="private">私密</Option>
                    <Option value="public">公开</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    }
  }

  export default Form.create<FormProps>()(ProductInfo)