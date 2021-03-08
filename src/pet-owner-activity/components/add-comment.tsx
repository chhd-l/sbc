import React, { Component } from 'react';
import { Input, Modal, Form, message } from 'antd';
import * as webapi from '../webapi';
import { Const } from 'qmkit';

const FormItem = Form.Item;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

class AddComment extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { petOwnerId } = this.props;
        const { comment } = this.state;
        this.setState({
          confirmLoading: true
        });
        webapi
          .addComment({ id: petOwnerId, content: comment })
          .then((data) => {
            const { res } = data;
            if (res.code === 'K-000000') {
              message.success('Operate successfully');
              this.setState({
                visible: false,
                confirmLoading: false
              });
              this.props.getActivities();
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
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    return null;
  }

  render() {
    const { visible, confirmLoading, comment } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal width={700} visible={visible} title="Add Comment" onOk={this.handleSubmit} confirmLoading={confirmLoading} maskClosable={false} onCancel={() => this.props.closeModel()} okText="Confirm">
        <Form>
          <FormItem {...layout} label="Comment">
            {getFieldDecorator('name', {
              initialValue: comment,
              rules: [{ required: true, message: 'Please input comment' }]
            })(
              <Input.TextArea
                maxLength={2000}
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
    );
  }
}
export default Form.create()(AddComment);
