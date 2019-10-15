import React, { PureComponent } from 'react'
import { Upload, Icon, Modal, Row, Col,Alert, Button, Tooltip,Popconfirm, Card, Input, Form, Switch, message} from 'antd';
import Typography from 'antd/lib/typography/Typography';
import QueueAnim from 'rc-queue-anim';
import styles from './stylesUpload.less'
const { Dragger } = Upload;
const { Meta } = Card;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    currentImage : {},
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        id: '-1',
        name: 'image.png',
        status: 'done',
        cover : true,
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        id: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        id: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        id: '-4',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        id: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleDetail = ( file )=> {
      this.setState(state => ({...state,currentImage : file}))
    
  }

  validate = ()=>{
    const { form : { validateFieldsAndScroll }} = this.props

    validateFieldsAndScroll((error, values) => {
      console.log('submit values', values, error);
      if (!error ) {
        // submit the values
        this.handleDetail({})
        message.success('Imagen actualizada')
        
      }
    });

}


  render() {
    const { previewVisible, previewImage, fileList, currentImage } = this.state;
    const { form: { getFieldDecorator } } = this.props
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Subir imagen</div>
      </div>
    );
    const formItemLayout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
      };

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };

      

    return (
          <Row gutter={12}>
              <Col xs={24} sm={24} md={18}>
                  <QueueAnim component='div' type={['left','right']} className={styles.imglist}>
                      {fileList.map(image => <div className={styles.item} key={image.id}
                      
                      >
                          <div className={styles.actions} >
                            <Tooltip title='Vista previa'>
                              <Button type='link' onClick={e => this.handlePreview(image)}>

                                  <Icon type='eye' />
                              </Button>
                            </Tooltip>

                            <Tooltip title='Editar información'>
                              <Button type='link' onClick={e => this.handleDetail(image)}>
                                  <Icon type='info-circle' />
                              </Button>
                            </Tooltip>
                            <Tooltip title='Borrar imagen'>
                            <Popconfirm
                                title="Seguro de borrar es imagen"
                                // onConfirm={confirm}
                                // onCancel={cancel}
                                okText="Si"
                                cancelText="No"
                            >
                                    <Button ghost type='danger' onClick={e => this.handleDetail(image)}>
                                        <Icon type='delete' />
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                            </div>
                          <img src={image.url} alt={image.name} />
                          {image.cover && <div className={styles.coverLabel}>
                            Portada
                          </div>}
                      </div>)}
                  </QueueAnim>
                <Dragger {...props}>
                    <Typography>
                        <Icon type='inbox' />
                        Arrastre aquí las imágenes
                    </Typography>
                    {uploadButton}
                </Dragger>
              
              </Col>
              <Col xs={24} sm={24} md={6}>
                  <QueueAnim type={['top','bottom']}
                    
                  >
                      {currentImage.id && 
                      <Card key="1"
                      cover={<img src={currentImage.url}  />}
                      size='small'
                      extra={<>Detalles de la imagen <Tooltip title="cerrar"> <Button type='link' onClick={e => this.handleDetail({})} icon='close'></Button> </Tooltip></>}
                      actions={[
                        <Tooltip title="Cerrar">
                            <Icon type="close" key="ellipsis" onClick={ e => this.handleDetail({})} />
                        </Tooltip>,
                        <Tooltip title="Guardar cambios">
                            <Icon type="save" key="ellipsis" onClick={this.validate} />
                        </Tooltip>,
                      ]}
                      >
                          <Form.Item label="Texto Alt">
                          {getFieldDecorator('alt', {
                              rules: [{ required: true, message: 'Texto Alt es obligatorio' }],
                            })(<Input />)}
                          </Form.Item>
                          <Form {...formItemLayout}>
                            <Form.Item label="Portada">
                            {getFieldDecorator('cover', {
                                })(<Switch />)}
                            </Form.Item>

                          </Form>
                        
                      </Card>}

                      {!currentImage.id && 
                      <Card key="2"
                      >
                          

                        <Alert key="2" type='info' showIcon message={
                            <Typography>
                                Seleccione una imagen
                            </Typography>
                        } />
                       

                      </Card>}

                  </QueueAnim>

              </Col>
      <div className="clearfix">

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    </Row>
    );
  }
}

export default Form.create({name:'images'})(PicturesWall)