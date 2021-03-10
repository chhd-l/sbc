import React from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Alert, Button, Spin, message } from 'antd';
import Fields from './component/fields';
import Manage from './component/manage';
import { getFieldList, saveFieldList } from './webapi';
import './index.less';

export default class AddressFieldSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      step: 1,
      fieldList: []
    };
  }

  componentDidMount() {
    this.getFieldList();
  }

  getFieldList = () => {
    getFieldList().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          fieldList: data.res.context.addressDisplaySettings
        });
      }
    });
  };

  onStepChange = (step: number) => {
    this.setState({
      step: step
    });
  };

  onFieldChange = (id: number, field: any) => {
    const { fieldList } = this.state;
    const _idx = fieldList.findIndex((item) => item.id === id);
    if (_idx > -1) {
      fieldList[_idx] = { ...fieldList[_idx], ...field };
      this.setState({
        fieldList: fieldList
      });
    }
  };

  saveFieldSetting = () => {
    this.setState({ loading: true });
    saveFieldList({ batchAddressDisplaySettingEditItems: this.state.fieldList })
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
    const { loading, step, fieldList } = this.state;
    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={step === 1 ? 'Address field setting' : 'Manage field display'} />
            <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
            {step === 1 && (
              <Button type="primary" onClick={() => this.onStepChange(2)} style={{ marginBottom: 10 }}>
                Manage display
              </Button>
            )}
            {step === 1 ? <Fields fieldList={fieldList} onFieldChange={this.onFieldChange} /> : <Manage fieldList={fieldList} onFieldChange={this.onFieldChange} />}
          </div>
          {step === 2 && (
            <div className="bar-button">
              <Button type="primary" onClick={this.saveFieldSetting}>
                Save
              </Button>
            </div>
          )}
        </Spin>
      </div>
    );
  }
}
