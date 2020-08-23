import * as React from 'react';
import { Modal, Icon, Input, Checkbox, Button, message } from 'antd';
import { noop, util } from 'qmkit';
import { Relax } from 'plume2';
import copy from 'copy-to-clipboard'; //拷贝插件

@Relax
/*发布*/
export default class DetailPublish extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      getLink: any;
      onSharing: Function;
    };
  };

  static relaxProps = {
    sharing: 'sharing',
    getLink: 'getLink',
    onSharing: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      show: false
    };
  }

  handleOk = (e) => {
    const { sharing } = this.props.relaxProps;
    let sharingObj = sharing.toJS();
    if (
      sharingObj.firstName != '' &&
      sharingObj.lastName != '' &&
      sharingObj.email != '' &&
      sharingObj.emailChecked != ''
    ) {
      if (util.checkEmail(sharingObj.email) == true) {
        console.log(sharingObj, 111111111111111);
      } else {
        message.error('Email format error!');
        return false;
      }
    } else {
      message.error('* Cannot be empty!');
      return false;
    }
  };

  handleCancel = (e) => {
    this.props.showModal(false);
  };
  handleSendAnother = (e) => {
    this.props.showModal(false);
  };
  copyLink = (e) => {
    if (copy(e)) {
      message.success('Copy successfully!');
    } else {
      message.error('Copy failed!');
    }
  };

  //选择框
  CheckboxChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, ok, cancel } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  render() {
    const { sharing, onSharing, getLink } = this.props.relaxProps;
    return (
      <div id="publishButton">
        <Modal
          width={800}
          title={
            //主要实现代码此处可传入一个html结构组件也是可以的
            <div style={{ color: '#e2001a', fontSize: 18 }}>Sharing</div>
          }
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            <Button key="back" onClick={this.handleCancel}>
              Exit
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Send
            </Button>,
            <Button
              key="Another"
              type="primary"
              onClick={this.handleSendAnother}
            >
              Send & Another
            </Button>
          ]}
        >
          <div className="share">
            <div className="title">
              <span>*</span>First Name
            </div>
            <Input
              type="text"
              placeholder="Input First Name"
              value={sharing.get('firstName')}
              onChange={(e) => {
                const value = (e.target as any).value;
                onSharing({
                  field: 'firstName',
                  value
                });
              }}
            />
          </div>
          <div className="share">
            <div className="title">
              <span>*</span>Last Name
            </div>
            <Input
              type="text"
              placeholder="Input Last Name"
              value={sharing.get('lastName')}
              onChange={(e) => {
                const value = (e.target as any).value;
                onSharing({
                  field: 'lastName',
                  value
                });
              }}
            />
          </div>
          <div className="share">
            <div className="title">
              <span>*</span>
              <Checkbox
                onChange={(e) => {
                  const value = (e.target as any).checked;
                  onSharing({
                    field: 'emailChecked',
                    value
                  });
                }}
              />
              The customer has agreed to send the E-mail
            </div>
          </div>
          <div className="share">
            <div className="title">
              <span>*</span>E-mail
            </div>
            <Input
              type="text"
              placeholder="Input E-mail"
              value={sharing.get('email')}
              onChange={(e) => {
                const value = (e.target as any).value;
                onSharing({
                  field: 'email',
                  value
                });
              }}
            />
          </div>
          <div className="share">
            <div className="title">Phone Number</div>
            <Input
              type="text"
              placeholder="Input the phone number"
              value={sharing.get('phoneNumber')}
              onChange={(e) => {
                const value = (e.target as any).value;
                onSharing({
                  field: 'phoneNumber',
                  value
                });
              }}
            />
          </div>
          <div className="link space-between">
            <div style={{ paddingTop: 4, marginLeft: 2 }}>
              <Icon type="link" />
              <span style={{ marginLeft: 5, color: '#8f0101' }}>
                https://shopuat.466920.com/details/{getLink}
              </span>
            </div>
            <div>
              <Button
                onClick={() =>
                  this.copyLink(`https://shopuat.466920.com/details/${getLink}`)
                }
              >
                Copy the link
              </Button>
            </div>
          </div>
          <div style={{ paddingTop: 4 }}>
            <span style={{ marginLeft: 2, fontSize: 12, color: '#ccc' }}>
              The share link has been generated and will be invalid after 7 days
            </span>
          </div>
        </Modal>
      </div>
    );
  }
}
