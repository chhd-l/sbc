import React, { Component } from 'react';
import { BreadCrumb, Const, RCi18n } from 'qmkit';
import {
  Table,
  Tooltip,
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Spin,
  Popconfirm,
  Modal
} from 'antd';
import * as webapi from './webapi';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FormItem = Form.Item;

class PetOwnerBlockList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      title: 'Pet owner blocklist',
      taggingList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      modalName: '',
      visible: false,
      blocklistForm: {
        name: ''
      },
      isEditErrorMessage: false
    };
  }

  getBlockList = () => {
    const { pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };
    this.setState({
      loading: true
    });
    webapi
      .getTaggingList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { pagination } = this.state;
          let taggingList = res.context.segmentList;
          pagination.total = res.context.total;
          this.setState({
            taggingList,
            loading: false,
            pagination
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getBlockList()
    );
  };

  openAddPage = () => {
    let blocklistForm = {
      name: ''
    };
    this.setState({
      modalName: 'Add email to blocklist',
      visible: true,
      blocklistForm,
      isEditErrorMessage: false
    });
  };

  editErrorMessage = () => {
    let blocklistForm = {
      name: 'your email has be blocked'
    };
    this.setState({
      modalName: 'Edit Error Message',
      visible: true,
      blocklistForm,
      isEditErrorMessage: true
    });
  };

  deleteTagging = (id) => {
    let idList = [];
    idList.push(id);
    let params = {
      idList: idList
    };
    webapi
      .deleteTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.getBlockList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  handleClose = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      isEditErrorMessage: false
    });
  };

  handleSubmit = () => {
    const { isEditErrorMessage} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };

  render() {
    const {
      loading,
      title,
      taggingList,
      pagination,
      blocklistForm,
      modalName,
      visible,
      isEditErrorMessage
    } = this.state;

    const columns = [
      {
        title: 'Eamil',
        dataIndex: 'email'
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <div>
            <Popconfirm
              placement="topLeft"
              title="Are you sure you want to delete this email?"
              onConfirm={() => this.deleteTagging(record.id)}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Tooltip placement="top" title="Delete">
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    let field = isEditErrorMessage ? 'Error Message' : 'Email';
    let fieldError = isEditErrorMessage ? 'Error Message is required' : 'Email is required';
    let emailValidate = !isEditErrorMessage
      ? { type: 'email', message: RCi18n({ id: 'Order.EmailFormatError' }) }
      : {};
    return (
      <div>
        <Spin spinning={loading}>
          <BreadCrumb thirdLevel={true}></BreadCrumb>
          <div className="container-search">
            <Row>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Button
                  type="primary"
                  style={{ margin: '10px 0 10px 0' }}
                  onClick={() => this.openAddPage()}
                >
                  <span>Add email to blocklist</span>
                </Button>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  style={{ margin: '10px 0 10px 0' }}
                  onClick={() => this.editErrorMessage()}
                >
                  <span>Edit error message</span>
                </Button>
              </Col>
            </Row>

            <Table
              style={{ paddingRight: 20 }}
              rowKey="id"
              columns={columns}
              dataSource={taggingList}
              pagination={pagination}
              scroll={{ x: '100%' }}
              onChange={this.handleTableChange}
            />
          </div>
        </Spin>
        <Modal
          zIndex={1000}
          width="600px"
          title={modalName}
          visible={visible}
          confirmLoading={loading}
          maskClosable={false}
          onCancel={this.handleClose}
          footer={[
            <Button key="back" onClick={this.handleClose}>
              Close
            </Button>,
            <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
              Submit
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <FormItem label={field}>
              {getFieldDecorator('taggingName', {
                rules: [
                  {
                    required: true,
                    message: fieldError
                  },
                  emailValidate
                ],
                initialValue: blocklistForm.name
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    blocklistForm.name = value;
                    this.setState({
                      blocklistForm
                    });
                  }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(PetOwnerBlockList);
