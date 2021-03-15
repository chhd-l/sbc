import React from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Alert, Button, Spin, message, Row, Col } from 'antd';
import Fields from './component/fields';
import Manage from './component/manage';
import RuleSetting from './component/rule-setting';
import { getFieldList, saveFieldList } from './webapi';
import './index.less';

export default class AddressFieldSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      step: 1,
      manualFieldList: [],
      autoFieldList: [],
      activeKey: 'MANUALLY'
    };
  }

  componentDidMount() {
    this.getFieldList();
  }

  getFieldList = async () => {
    const manual = await getFieldList('MANUALLY');
    const auto = await getFieldList('AUTOMATICALLY');
    this.setState({
      manualFieldList: manual,
      autoFieldList: auto
    });
  };

  onChangeActiveKey = (key: string) => {
    this.setState({
      activeKey: key
    });
  };

  onCloseModal = () => {
    this.setState({
      visible: false
    });
  };

  onOpenModal = () => {
    this.setState({
      visible: true
    });
  };

  onStepChange = (step: number) => {
    this.setState({
      step: step
    });
  };

  onFieldChange = (id: number, field: any) => {
    const { activeKey, manualFieldList, autoFieldList } = this.state;
    const fieldList = activeKey === 'MANUALLY' ? manualFieldList : autoFieldList;
    const _idx = fieldList.findIndex((item) => item.id === id);
    if (_idx > -1) {
      fieldList[_idx] = { ...fieldList[_idx], ...field };
      this.setState({
        [activeKey === 'MANUALLY' ? 'manualFieldList' : 'autoFieldList']: fieldList
      });
    }
  };

  saveFieldSetting = () => {
    this.setState({ loading: true });
    saveFieldList({ batchAddressDisplaySettingEditItems: this.state.manualFieldList.concat(this.state.autoFieldList) })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
        }
        this.setState({
          step: 1,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, visible, step, manualFieldList, autoFieldList, activeKey } = this.state;
    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Row style={{ marginBottom: 10 }}>
              <Col span={12}>
                <Headline title={step === 1 ? 'Address field setting' : 'Manage field display'} />
              </Col>
              <Col span={12} className="text-align-right">
                {step === 1 ? <Button onClick={() => this.onOpenModal()}>Rule setting</Button> : null}
              </Col>
            </Row>
            <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
            {step === 1 ? (
              <Fields manualFieldList={manualFieldList} autoFieldList={autoFieldList} activeKey={activeKey} onChangeActiveKey={this.onChangeActiveKey} onFieldChange={this.onFieldChange} onStepChange={this.onStepChange} />
            ) : (
              <Manage fieldList={activeKey === 'MANUALLY' ? manualFieldList : autoFieldList} onFieldChange={this.onFieldChange} />
            )}
          </div>
          {step === 2 && (
            <div className="bar-button">
              <Button type="primary" onClick={this.saveFieldSetting}>
                Save
              </Button>
            </div>
          )}
        </Spin>
        <RuleSetting visible={visible} onCloseModal={this.onCloseModal} />
      </div>
    );
  }
}
