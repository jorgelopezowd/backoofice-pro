import {
    Button,
    Card,
    Col,
    Form,
    Icon,
    Input,
    Row,
    Select,
    Typography
  } from 'antd';
  import React, { PureComponent } from 'react';
  import { FormComponentProps } from 'antd/es/form';
  
  import styles from './../../style.less';
  import slugFormat from '@/utils/slugFormat'

  const { Option } = Select;
  const {TextArea} = Input
  const {Title, Paragraph, Text} = Typography

  const fieldLabels = {
    slug: 'Url Amigable',
    seoTitle : 'Título',
    seoDescription : 'Descripción'
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

        return  <Card title="Datos para SEO" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col md={12} xs={24}>
              
              <Row gutter={16}>
                <Col sm={24}>
                {langs.map((itemLang : any) => (
                  <Form.Item label={`${fieldLabels.slug} (${itemLang.label})`}
                  style={itemLang.id === lang ? {} : { display: 'none' }}
                  >
                    {getFieldDecorator(`${itemLang.id}.slug`, {
                      rules: [{ required: true, message: 'Url Amigable' }],
                    })(<Input 
                      onBlur={e => setFieldsValue({[`${itemLang.id}.slug`]: slugFormat(e.target.value) })}
                      placeholder="URL amigable" 
                      maxLength={256}
                      prefix={<Icon type='link' />} 
                    />)}
                  </Form.Item>
                ))}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={24}>
                  {langs.map((itemLang : any) => (
                  <Form.Item label={`${fieldLabels.seoTitle} (${itemLang.label})`}
                    style={itemLang.id === lang ? {} : { display: 'none' }}
                  >
                    {getFieldDecorator(`${itemLang.id}.seoTitle`, {
                      rules: [{ required: true, message: 'Titulo' }],
                    })(
                      <Input placeholder="Titulo SEO" maxLength={60} />
                    )}
                  </Form.Item>
                  ))}
                </Col>
              
              
              </Row>

              <Row gutter={16}>
                <Col sm={24}>
                  {langs.map((itemLang : any) => (
                  <Form.Item label={`${fieldLabels.seoDescription} (${itemLang.label})`}
                    style={itemLang.id === lang ? {} : { display: 'none' }}
                  >
                    {getFieldDecorator(`${itemLang.id}.seoDescription`, {
                      rules: [{ required: true, message: 'Descripción' }],
                    })(
                      <TextArea placeholder="Descripción SEO" maxLength={160} rows={5} />
                    )}
                  </Form.Item>
                  ))}
                </Col>
              
              
              </Row>
            </Col>
            <Col md={12} xs={24}>
              {langs.map((itemLang : any) => (
              <Row gutter={8} hidden={lang !== itemLang.id}>
                <Col xs={24}>
                    
                    <Card title={`Ejemplo de google >> ${itemLang.label}`} style={{marginTop:28}} >
                      <span className={styles.googleTitle}>{getFieldValue(`${itemLang.id}.title`) || 'Título en google'}</span>
                      <span className={styles.googleLink}>{getFieldValue(`${itemLang.id}.slug`) || 'http://enlace.com'}</span>
                      <span className={styles.googleDescription}>{getFieldValue(`${itemLang.id}.seoDescription`) || 'Descripción Google'}</span>

                    </Card>
                </Col>
              </Row>
              ))}
            </Col>
          </Row>
        </Form>
      </Card>
    }
  }

  export default Form.create<FormProps>()(ProductInfo)