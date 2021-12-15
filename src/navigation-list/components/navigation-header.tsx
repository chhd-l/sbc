import React from 'react';
import { Input, message, Row, Col, Button } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getStoreHeader, saveStoreHeader } from '../webapi';

const TextArea = Input.TextArea;

export default class NavigationHeader extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: '',
      header: '',
      footer: ''
    }
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    getStoreHeader().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          id: data.res.context.id,
          header: data.res.context.header,
          footer: data.res.context.footer
        });
      }
    });
  };

  onChangeField = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  saveData = () => {
    this.setState({ loading: true });
    saveStoreHeader({
      id: this.state.id,
      header: this.state.header,
      footer: this.state.footer
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({id:'Setting.Operationsuccessful'}));
      }
      this.setState({ loading: false });
    }).catch(() => { this.setState({ loading: false }); });
  };

  render() {
    const { header, footer, loading } = this.state;
    return (
      <div>
        <Row gutter={[24, 12]}>
          <Col span={3} style={{textAlign:'right',color:'#333'}}><FormattedMessage id="Setting.header"/>:</Col>
          <Col span={18}>
            <TextArea rows={6} value={header} onChange={(e) => this.onChangeField('header', e.target.value)}></TextArea>
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col span={3} style={{textAlign:'right',color:'#333'}}><FormattedMessage id="Setting.footer"/>:</Col>
          <Col span={18}>
            <TextArea rows={6} value={footer} onChange={(e) => this.onChangeField('footer', e.target.value)}></TextArea>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={6} push={3}>
            <Button type="primary" loading={loading} onClick={this.saveData}><FormattedMessage id="Setting.save"/></Button>
          </Col>
        </Row>
      </div>
    );
  }

}
