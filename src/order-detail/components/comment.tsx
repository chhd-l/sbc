import React, { Component } from 'react';
import { List, Tooltip, Popconfirm, Input, Row, Button, Modal, Form, message } from 'antd';
import * as webapi from '../webapi';

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
      list: [
        {
          content: '12345\ncde',
          createdByUser: 'Mia Lin',
          dateAdded: '2021-01-29 11:03:56',
          id: 14,
          module: 'order',
          relationId: '99932394'
        },
        {
          content: 'i have comment',
          createdByUser: 'Antonia Ye',
          dateAdded: '2021-01-25 11:35:00',
          id: 11,
          module: 'order',
          relationId: '99932394'
        }
      ],
      showSearch: false,
      commentVisible: false,
      confirmLoading: false,
      comment: ''
    };
    this.deleteComment = this.deleteComment.bind(this);
    this.searchComment = this.searchComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editFeedback = this.editFeedback.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'input-search-btn' || e.target.id === 'input-search') {
        this.setState({
          showSearch: true
        });
      } else {
        this.setState({
          showSearch: false
        });
      }
    });
  }

  deleteComment(id) {}

  searchComment(value, e) {
    e.preventDefault();
  }

  editFeedback(value) {
    this.setState({
      commentVisible: true,
      comment: value
    });
  }

  handleSubmit() {
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFields((err) => {
      if (!err) {
        webapi
          .updateFeedback({ content: this.state.comment })
          .then((data) => {
            const { res } = data;
            if (res.code === 'K-000000') {
              message.success('Operate successfully');
              this.setState({
                commentVisible: false,
                confirmLoading: false
              });
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
    const { initLoading, loading, list, showSearch, commentVisible, confirmLoading, comment } = this.state;
    return (
      <div>
        <Row style={{ textAlign: 'right' }}>
          {showSearch ? <Search id="input-search" style={{ marginLeft: '16px', width: '272px' }} onSearch={this.searchComment} /> : <Button id="input-search-btn" shape="circle" icon="search" onClick={() => this.setState({ showSearch: true })} />}
          <span style={{ marginLeft: '10px' }}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.setState({ commentVisible: true });
              }}
            >
              Add Feedback
            </Button>
          </span>
        </Row>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={list}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tooltip placement="top" title="Edit">
                  <a onClick={() => this.editFeedback(item.content)}>
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
              ]}
            >
              <List.Item.Meta title={<span style={{ fontWeight: 600 }}>{item.content}</span>} />
              <div>
                <p style={{ marginBottom: '1em' }}>{item.createdByUser}</p>
                <p>{item.dateAdded}</p>
              </div>
            </List.Item>
          )}
        />
        <Modal width={700} visible={commentVisible} title="Add Comments" onOk={this.handleSubmit} confirmLoading={confirmLoading} maskClosable={false} onCancel={this.closeModal} okText="Confirm">
          <Form>
            <FormItem {...layout} label="Pet Owner">
              {getFieldDecorator('name', {
                initialValue: petOwnerName
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Order Number">
              {getFieldDecorator('name', {
                initialValue: orderNumber
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Feedback">
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
        </Modal>
      </div>
    );
  }
}
export default Form.create()(comment);
