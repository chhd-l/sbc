/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 13:10:59
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-02 15:41:12
 * @FilePath: \sbc-supplier-front\src\navigation-list\components\navigation-header.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
      changed: false,
      id: '',
      header: '',
      footer: '',
      marsFooter: ''
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
          footer: data.res.context.footer,
          marsFooter: data.res.context.marsFooter
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
    saveStoreHeader({
      id: this.state.id,
      footer: this.state.footer,
      marsFooter: this.state.marsFooter
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({id:'Setting.Operationsuccessful'}));
      }
      this.setState({ loading: false, changed: false });
    }).catch(() => { this.setState({ loading: false }); });
  };

  render() {
    const { footer, marsFooter, loading, changed } = this.state;
    return (
      <div>
        <Row gutter={[24, 12]}>
          <Col span={3} style={{textAlign:'right',color:'#333'}}><FormattedMessage id="Setting.footer"/>:</Col>
          <Col span={18}>
            <TextArea rows={6} value={footer} onChange={(e) => this.onChangeField('footer', e.target.value)}></TextArea>
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col span={3} style={{textAlign:'right',color:'#333'}}><FormattedMessage id="Setting.marsFooter"/>:</Col>
          <Col span={18}>
            <TextArea rows={6} value={marsFooter} onChange={(e) => this.onChangeField('marsFooter', e.target.value)}></TextArea>
          </Col>
        </Row>
        <Row className='bar-button' style={{marginLeft: '-20px'}}>
          <Col span={12}>
            <Button type="primary" disabled={!changed} loading={loading} onClick={this.saveData}><FormattedMessage id="Setting.save"/></Button>
          </Col>
        </Row>
      </div>
    );
  }

}
