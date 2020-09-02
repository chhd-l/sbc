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
      send: any;
      onSharing: Function;
      onSend: Function;
    };
  };

  static relaxProps = {
    sharing: 'sharing',
    getLink: 'getLink',
    send: 'send',
    onSharing: noop,
    onSend: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      show: false,
      checked: false
    };
  }

  verification = () => {
    const { sharing } = this.props.relaxProps;
    let sharingObj = sharing.toJS();
    if (
      sharingObj.consumerFirstName != '' &&
      sharingObj.consumerLastName != '' &&
      sharingObj.consumerEmail != '' &&
      sharingObj.emailConsent != ''
    ) {
      if (util.checkEmail(sharingObj.consumerEmail) == true) {
        return sharingObj;
        //onSend(Object.assign({}, sharingObj, {id:getLink}))
      } else {
        message.error('Email format error!');
        return false;
      }
    } else {
      message.error('* Cannot be empty!');
      return false;
    }
  };

  handleOk = (e) => {
    const { onSend, getLink, sharing } = this.props.relaxProps;
    let sharingObj = sharing.toJS();
    if (
      sharingObj.consumerFirstName != '' &&
      sharingObj.consumerLastName != '' &&
      sharingObj.consumerEmail != '' &&
      sharingObj.emailConsent != '' &&
      util.checkEmail(sharingObj.consumerEmail) == true
    ) {
      onSend(
        'send',
        Object.assign({}, this.verification(), { base64Id: getLink })
      );
    } else {
      this.verification();
    }
  };

  handleCancel = (e) => {
    (this as any).props.showModal(false);
  };

  handleSendAnother = async (param?: any) => {
    const { onSend, getLink, send, onSharing, sharing } = this.props.relaxProps;
    Promise.all([
      onSend(
        'addSend',
        Object.assign({}, this.verification(), { base64Id: getLink })
      ),
      onSharing({ field: 'consumerFirstName', value: '' }),
      onSharing({ field: 'consumerLastName', value: '' }),
      onSharing({ field: 'emailConsent', value: 0 }),
      onSharing({ field: 'consumerEmail', value: '' }),
      onSharing({ field: 'consumerPhoneNumber', value: '' }),
      this.setState({ checked: !this.state.checked })
    ]).then((values) => {
      //console.log(values);
    });
  };

  copyLink = (e) => {
    if (copy(e)) {
      message.success('Copy successfully!');
    } else {
      message.error('Copy failed!');
    }
  };

  //选择框
  onCheck = (e) => {
    const { onSharing } = this.props.relaxProps;

    this.setState({
      checked: e.target.checked
    });
    onSharing({
      field: 'emailConsent',
      value: e.target.checked == true ? 1 : 0
    });
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
    const clear = this.state.clear;
    return (
      <div id="publishButton">
        <div className="share">
          <div className="title">
            <span>*</span>First Name
          </div>
          <Input
            type="text"
            placeholder="Input First Name"
            value={sharing.get('consumerFirstName')}
            onChange={(e) => {
              const value = (e.target as any).value;
              onSharing({
                field: 'consumerFirstName',
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
            value={sharing.get('consumerLastName')}
            onChange={(e) => {
              const value = (e.target as any).value;
              onSharing({
                field: 'consumerLastName',
                value
              });
            }}
          />
        </div>
        <div className="share">
          <div className="title">
            <span>*</span>
            <Checkbox
              onChange={this.onCheck}
              /*onChange={(e) => {
                  const value = (e.target as any).checked;
                  onSharing({
                    field: 'emailConsent',
                    value: value == true ? 1 : 0
                  });
                }}*/
              checked={this.state.checked}
              //checked={this.state.checkbox}
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
            value={sharing.get('consumerEmail')}
            onChange={(e) => {
              const value = (e.target as any).value;
              onSharing({
                field: 'consumerEmail',
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
            value={sharing.get('consumerPhoneNumber')}
            onChange={(e) => {
              const value = (e.target as any).value;
              onSharing({
                field: 'consumerPhoneNumber',
                value
              });
            }}
          />
        </div>
        <div className="link space-between">
          <div style={{ paddingTop: 4, marginLeft: 2 }}>
            <Icon type="link" />
            <span style={{ marginLeft: 5, color: '#8f0101' }}>
              https://shopuat.466920.com/recommendation/{getLink}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <Button
            onClick={() =>
              this.copyLink(
                `https://shopuat.466920.com/recommendation/${getLink}`
              )
            }
          >
            Copy the link
          </Button>
        </div>
        <div style={{ paddingTop: 4, marginTop: '1rem' }}>
          <span
            style={{
              marginLeft: 2,
              fontSize: 12,
              color: '#ccc',
              float: 'left'
            }}
          >
            The share link has been generated and will be invalid after 7 days
          </span>
        </div>
        <Button key="back" onClick={this.handleCancel}>
          Exit
        </Button>
        ,
        <Button key="submit" type="primary" onClick={this.handleOk}>
          Send
        </Button>
      </div>
    );
  }
}
