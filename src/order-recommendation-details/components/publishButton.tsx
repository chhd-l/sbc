import React from 'react';
import { Table, Button, message } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, history, noop, util, RCi18n } from 'qmkit';
import '../style.less';
import PublishTooltip from './publishTooltip';

let linkType = 0;

@Relax
export default class PublishButton extends React.Component<any, any> {
  props: {
    relaxProps?: {
      productForm: any;
      createLink: any;
      productselect: any;
      fetchCreateLink: Function;
      onCreateLink: Function;
      onCreate: Function;
    };
  };

  static relaxProps = {
    settleList: 'settleList',
    productselect: 'productselect',
    productForm: noop,
    createLink: 'createLink',
    onCreateLink: noop,
    onCreate: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  showModal = (res) => {
    const {
      createLink,
      productselect,
      onCreateLink,
      onCreate
    } = this.props.relaxProps;
    if (createLink.toJS().recommendationGoodsInfoRels.length > 0) {
      let a = linkType > 0 ? true : false;
      onCreate(createLink.toJS(), a);
      this.setState({
        visible: res
      });
      linkType++;
    } else {
      message.error(RCi18n({id:'Order.RecommendedTip'}));
    }
  };

  render() {
    return (
      <div>
        <Button
          shape="round"
          style={{ width: 80, marginRight: 10 }}
          //href="/recomm-page"
          onClick={() => history.goBack()}
        >
          {RCi18n({id:'Order.btnCancel'})}
        </Button>
        {history.location.state ? null : (
          <Button
            type="primary"
            shape="round"
            onClick={() => this.showModal(true)}
          >
            {this.state.linkType == true ? RCi18n({id:'Order.CreateLink'}) : RCi18n({id:'Order.Sharing'})}
          </Button>
        )}
        <PublishTooltip
          visible={this.state.visible}
          showModal={this.showModal}
        />
      </div>
    );
  }
}
