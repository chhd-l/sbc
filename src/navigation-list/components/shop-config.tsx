import React from 'react';
import { Input, message, Row, Col, Button, Switch } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getShopConfig, saveShopConfig } from '../webapi';
import { decryptAES } from '../../../web_modules/qmkit/util';

const TextArea = Input.TextArea;

export default class NavigationHeader extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      changed: false,
      id: '',
      hubConfigChecked: false,
      baseConfigContext: '',
      baseHubConfigContext: '',
      phraseEnabled: false,
      branchName: ''
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    getShopConfig().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        const { hubConfigValue, baseConfigContext, baseHubConfigContext, phraseConfig } =
          data.res.context;
        this.setState({
          hubConfigChecked: !!hubConfigValue, // 1 启用hub 0不启用hub
          baseConfigContext: baseConfigContext ? decryptAES(baseConfigContext) : '',
          baseHubConfigContext: baseHubConfigContext ? decryptAES(baseHubConfigContext) : '',
          phraseEnabled: phraseConfig ? phraseConfig.phraseEnabled : false,
          branchName: phraseConfig ? phraseConfig.branchName : ''
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
    const { hubConfigChecked, baseConfigContext, baseHubConfigContext, phraseEnabled, branchName } =
      this.state;
    try {
      JSON.parse(baseConfigContext);
      JSON.parse(baseHubConfigContext);
    } catch (e) {
      message.error(e.message);
      return;
    }
    this.setState({ loading: true });
    saveShopConfig({
      hubConfigValue: hubConfigChecked ? 1 : 0, // 1 启用hub 0不启用hub
      baseConfigContext,
      baseHubConfigContext,
      phraseEnabled,
      branchName
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({ id: 'Setting.Operationsuccessful' }));
        }
        this.setState({ loading: false, changed: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      hubConfigChecked,
      baseConfigContext,
      baseHubConfigContext,
      loading,
      changed,
      phraseEnabled,
      branchName
    } = this.state;
    return (
      <div style={{ paddingBottom: '20px' }}>
        <Row gutter={[24, 12]}>
          <Col span={4} style={{ textAlign: 'right', color: '#333' }}>
            <FormattedMessage id="Setting.enabledHub" />:
          </Col>
          <Col span={18}>
            <Switch
              checked={hubConfigChecked}
              onChange={(e) => this.onChangeField('hubConfigChecked', e)}
            />
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col span={4} style={{ textAlign: 'right', color: '#333' }}>
            <FormattedMessage id="Setting.Content" />:
          </Col>
          <Col span={18}>
            <TextArea
              rows={6}
              value={baseConfigContext}
              onChange={(e) => this.onChangeField('baseConfigContext', e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col span={4} style={{ textAlign: 'right', color: '#333' }}>
            <FormattedMessage id="Setting.hubContent" />:
          </Col>
          <Col span={18}>
            <TextArea
              rows={6}
              value={baseHubConfigContext}
              onChange={(e) => this.onChangeField('baseHubConfigContext', e.target.value)}
            />
          </Col>
        </Row>
        {/* phrase app新增编辑控制switch && branch 分支管理*/}
        <Row gutter={[24, 12]}>
          <Col span={4} style={{ textAlign: 'right', color: '#333' }}>
            <FormattedMessage id="Setting.Phrase" />:
          </Col>
          <Col span={18}>
            <Switch
              checked={phraseEnabled}
              onChange={(e) => this.onChangeField('phraseEnabled', e)}
            />
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col span={4} style={{ textAlign: 'right', color: '#333' }}>
            <FormattedMessage id="Setting.BranchName" />:
          </Col>
          <Col span={8}>
            <Input
              value={branchName}
              onChange={(e) => this.onChangeField('branchName', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="bar-button" style={{ marginLeft: '-20px' }}>
          <Col span={12}>
            <Button
              type="primary"
              disabled={
                !changed || baseConfigContext.trim() === '' || baseHubConfigContext.trim() === ''
              }
              loading={loading}
              onClick={this.saveData}
            >
              <FormattedMessage id="Setting.save" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
