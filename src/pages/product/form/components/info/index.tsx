import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Tree,
  Tabs
} from 'antd';
import React, { PureComponent } from 'react';
import { FormComponentProps } from 'antd/es/form';

import styles from './../../style.less';
import UploadImages from './UploadImages'
import slugFormat from '@/utils/slugFormat'

const { Option } = Select;
const {TextArea} = Input
const { TabPane } = Tabs
const { TreeNode } = Tree

const fieldLabels = {
  description : 'Descripción',
  shortDescription : 'Resumen',
  ean13 : 'EAN13',
  barcode : 'Código de barra',
  reference : 'Referencia',
  sku : 'SKU',
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
  langs : [];
  lang : string;
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
          form: { getFieldDecorator, getFieldValue, setFieldsValue },
          lang, 
          langs
      } = this.props;

      return  <>
            <Row gutter={16}>
              <Col sm={24} md={24} lg={12}>
                <Card title="Información comercial" className={styles.card} bordered={false}>
                  <UploadImages />
                  <Tabs defaultActiveKey='1' tabPosition='top'>
                    <TabPane key='1' tab={fieldLabels.description}>
                      {langs.map((itemLang : any) => (
                      <Form.Item label={`${fieldLabels.description} (${itemLang.label})`}
                        style={itemLang.id === lang ? {} : { display: 'none' }}
                      >
                        {getFieldDecorator(`${itemLang.id}.description`, {
                          rules: [{ required: true, message: 'Descripción' }],
                        })(
                          <TextArea placeholder="Descripción" maxLength={160} rows={5} />
                        )}
                      </Form.Item>
                      ))}

                    </TabPane>
                    <TabPane key='2' tab={fieldLabels.shortDescription}>
                      {langs.map((itemLang : any) => (
                      <Form.Item label={`${fieldLabels.shortDescription} (${itemLang.label})`}
                        style={itemLang.id === lang ? {} : { display: 'none' }}
                      >
                        {getFieldDecorator(`${itemLang.id}.shortDescription`, {
                          rules: [{ required: true, message: 'Descripción' }],
                        })(
                          <TextArea placeholder="Resumen" maxLength={160} rows={5} />
                        )}
                      </Form.Item>
                      ))}

                    </TabPane>
                  </Tabs>
                  </Card>
              </Col>
              <Col sm={24} md={24} lg={12}>
                 <Card title="Datos de inventario" className={styles.card} bordered={false}>
                   <Row gutter={12}>
                     <Col xs={12}>
                      <Form.Item label={`${fieldLabels.reference}`}
                          
                        >
                          {getFieldDecorator(`reference`, {
                            rules: [{ required: true, message: `${fieldLabels.reference} es obligatorio` }],
                          })(
                            <Input placeholder="Referencia" maxLength={160} />
                          )}
                      </Form.Item>
                       
                     </Col>
                     <Col xs={12}>
                      <Form.Item label={`${fieldLabels.ean13}`}
                          
                        >
                          {getFieldDecorator(`ean13`, {
                          })(
                            <Input placeholder="Referencia" maxLength={13} />
                          )}
                      </Form.Item>

                     </Col>
                     <Col xs={12}>
                      <Form.Item label={`${fieldLabels.barcode}`}
                          
                        >
                          {getFieldDecorator(`barcode`, {
                            rules: [{ required: true, message: `${fieldLabels.barcode} es obligatorio` }],
                          })(
                            <Input placeholder="Código de barras" maxLength={160} />
                          )}
                      </Form.Item>

                     </Col>
                     <Col xs={12}>
                      <Form.Item label={`${fieldLabels.sku}`}
                          
                        >
                          {getFieldDecorator(`sku`, {
                          })(
                            <Input placeholder="SKU" maxLength={160} />
                          )}
                      </Form.Item>

                     </Col>
                   </Row>

                   
                </Card>
              </Col>

              <Col sm={24} md={24} lg={12}>
                <Card title="Categorías" className={styles.card} bordered={false}>
                <Tree
                    checkable
                    defaultExpandedKeys={['0-0-0', '0-0-1']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={['0-0-0', '0-0-1']}
                  >
                    <TreeNode title="parent 1" key="0-0">
                      <TreeNode title="parent 1-0" key="0-0-0" disabled>
                        <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                        <TreeNode title="leaf" key="0-0-0-1" />
                      </TreeNode>
                      <TreeNode title="parent 1-1" key="0-0-1">
                        <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
                      </TreeNode>
                    </TreeNode>
                  </Tree>
                </Card>
              </Col>
              </Row>
            <Row>
              <Col sm={24} md={24} lg={12}>
                <Card title="Caraterísticas" className={styles.card} bordered={false}>
                          <Row>
                            <Col xs={8}>
                              <Select defaultValue='1'>
                                {['caracteristica 1', '2','3'].map(item => 
                                (<Option value={item}>{item}</Option>)
                                  )}
                              </Select>
                            </Col>
                            <Col xs={8}>
                              <Select defaultValue='1'>
                                {['caracteristica 1', '2','3'].map(item => 
                                (<Option value={item}>{item}</Option>)
                                  )}
                              </Select>
                            </Col>
                          </Row>
                </Card>
              </Col>
            </Row>
            
           

            
         
      
   
    </>
  }
}

export default Form.create<FormProps>()(ProductInfo)