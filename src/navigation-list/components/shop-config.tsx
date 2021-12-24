import React from 'react';
import { Input, message, Row, Col, Button } from 'antd';
import { Const, RCi18n, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getConfigContext, saveShopConfig } from '../webapi';

const TextArea = Input.TextArea;
const base64 = new util.Base64();

export default class NavigationHeader extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      changed: false,
      id: '',
      header: '',
      footer: ''
    }
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    getConfigContext({
      configType: 'baseConfig'
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          footer: data.res.context.context
        });
      }
    });
  };

  onChangeField = (field, value) => {
    this.setState({
      [field]: value,
      changed: true
    });
  };

  saveData = () => {
    this.setState({ loading: true });
    saveShopConfig({
      context: this.state.footer
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({id:'Setting.Operationsuccessful'}));
      }
      this.setState({ loading: false, changed: false });
    }).catch(() => { this.setState({ loading: false }); });
  };

  render() {
    const { footer, loading, changed } = this.state;
    return (
      <div>
        <Row gutter={[24, 12]}>
          <Col span={4} style={{textAlign:'right',color:'#333'}}><FormattedMessage id="Menu.Content"/>:</Col>
          <Col span={18}>
            <TextArea rows={6} value={footer} onChange={(e) => this.onChangeField('footer', e.target.value)}></TextArea>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={6} push={4}>
            <Button type="primary" disabled={!changed || footer.trim() === ''} loading={loading} onClick={this.saveData}><FormattedMessage id="Setting.save"/></Button>
          </Col>
        </Row>
      </div>
    );
  }

}
