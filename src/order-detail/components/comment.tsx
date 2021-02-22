import React, { Component } from 'react';
import { List, Tooltip, Popconfirm, Input, Row, Button, Modal, Form, message } from 'antd';
import * as webapi from '../webapi';
import { Const } from 'qmkit';

const FormItem = Form.Item;
const { Search } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

class comment extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: false,
      loading: false,
      list: [],
      commentVisible: false,
      confirmLoading: false,
      comment: '',
      commentId: '',
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      searchValue: ''
    };
    this.deleteComment = this.deleteComment.bind(this);
    this.searchComment = this.searchComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editComment = this.editComment.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.searchComment('');
  }

  deleteComment(id) {
    this.setState({
      loading: true
    });
    webapi
      .deleteCommentById(id)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Delete successfully');
          this.searchComment(this.state.searchValue);
        } else {
          message.error(res.message || 'Delete Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Delete Failed');
        this.setState({
          loading: false
        });
      });
  }

  searchComment(value) {
    const { pagination } = this.state;
    const { orderNumber } = this.props;
    let params = Object.assign({
      orderId: orderNumber,
      content: value,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true,
      searchValue: value
    });
    webapi
      .getComments(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            list: res.context.content || [],
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          loading: false
        });
      });
  }

  editComment(commentId, comment) {
    this.setState({
      commentVisible: true,
      comment: comment,
      commentId: commentId
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { orderNumber } = this.props;
        const { commentId, comment, searchValue } = this.state;
        this.setState({
          confirmLoading: true
        });
        if (commentId) {
          webapi
            .updateComment({ id: commentId, content: comment })
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                this.setState({
                  commentVisible: false,
                  confirmLoading: false
                });
                this.searchComment(searchValue);
              } else {
                message.error(res.message || 'Add Failed');
                this.setState({
                  confirmLoading: false
                });
              }
            })
            .catch((err) => {
              message.error(err || 'Add Failed');
              this.setState({
                confirmLoading: false
              });
            });
        } else {
          webapi
            .addComment({ orderId: orderNumber, content: comment })
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                this.setState({
                  commentVisible: false,
                  confirmLoading: false
                });
                this.searchComment(searchValue);
              } else {
                message.error(res.message || 'Update Failed');
                this.setState({
                  confirmLoading: false
                });
              }
            })
            .catch((err) => {
              message.error(err || 'Update Failed');
              this.setState({
                confirmLoading: false
              });
            });
        }
      }
    });
  }

  closeModal() {
    this.setState({
      commentVisible: false,
      comment: ''
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orderNumber, petOwnerName } = this.props;
    const { initLoading, loading, list, commentVisible, confirmLoading, comment, pagination, searchValue } = this.state;
    return (
      <div>
        <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Search id="input-search" style={{ marginLeft: '16px', width: '272px' }} onSearch={this.searchComment} />
          <span style={{ marginLeft: '10px' }}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.setState({ commentVisible: true, comment: '' });
              }}
            >
              Add Comment
            </Button>
          </span>
        </Row>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={list}
          pagination={{
            onChange: (page, pageSize) => {
              this.setState(
                {
                  pagination: {
                    current: page,
                    pageSize: pageSize
                  }
                },
                () => this.searchComment(searchValue)
              );
            },
            ...pagination
          }}
          renderItem={(item) => (
            <List.Item
              actions={
                item.operableFlag
                  ? [
                      <Tooltip placement="top" title="Edit">
                        <a onClick={() => this.editComment(item.id, item.content)}>
                          {' '}
                          <span className="icon iconfont iconEdit" style={{ fontSize: 20 }}></span>
                        </a>
                      </Tooltip>,
                      <Popconfirm placement="topLeft" title="Are you sure you want to delete this comment?" onConfirm={() => this.deleteComment(item.id)} okText="Confirm" cancelText="Cancel">
                        <Tooltip placement="top" title="Delete">
                          <a>
                            <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                          </a>
                        </Tooltip>
                      </Popconfirm>
                    ]
                  : [<div style={{ width: 56 }}></div>]
              }
            >
              <List.Item.Meta title={<span style={{ fontWeight: 600 }}>{item.content}</span>} />
              <div>
                <p style={{ marginBottom: '1em' }}>{item.createPersonNickName}</p>
                <p>{item.createTime}</p>
              </div>
            </List.Item>
          )}
        />
      { commentVisible ? <Modal width={700} visible={commentVisible} title="Add Comment" onOk={this.handleSubmit} confirmLoading={confirmLoading} maskClosable={false} onCancel={this.closeModal} okText="Confirm">
          <Form>
            <FormItem {...layout} label="Pet Owner">
              {getFieldDecorator('petOwner', {
                initialValue: petOwnerName
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Order Number">
              {getFieldDecorator('orderNumber', {
                initialValue: orderNumber
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Comment">
              {getFieldDecorator('name', {
                initialValue: comment,
                rules: [{ required: true, message: 'Please input comment' }]
              })(
                <Input.TextArea
                  placeholder="Please input comment"
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.setState({
                      comment: value
                    });
                  }}
                />
              )}
            </FormItem>
          </Form>
        </Modal> : null }  
      </div>
    );
  }
}
export default Form.create()(comment);
