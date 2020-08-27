import React from 'react';
import { Table, Button, message } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, history, noop, util } from 'qmkit';
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
      message.error('Recommended product cannot be empty !');
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
          Cancel
        </Button>
        {history.location.state ? null : (
          <Button
            type="primary"
            shape="round"
            onClick={() => this.showModal(true)}
          >
            {this.state.linkType == true ? 'Create Link' : 'Sharing'}
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
