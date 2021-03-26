import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, Const } from 'qmkit';
import { Row, Spin, Table, Radio, Col, Switch, Button, message } from 'antd';
import * as webapi from './webapi';
import './style.less';

export default class PrescriberSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      buttonLoadding: false,
      productCategoryData: [],
      listSystemConfig: [],
      selectType: 'selection_type',
      ifPrescriberMandatory: 'if_prescriber_is_not_mandatory',
      showConfig: true
    };
    this.savePrescriberSetting = this.savePrescriberSetting.bind(this);
    this.getListSystemConfig = this.getListSystemConfig.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getListSystemConfig();
    this.getProductCategory();
  }

  getListSystemConfig() {
    this.setState({
      loading: true
    });
    webapi
      .getListSystemConfig()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            listSystemConfig: res.context
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          loading: false
        });
      });
  }
  getProductCategory() {
    webapi
      .getGoodsCatesByStoreId()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let needPrescriberCategory = res.context ? res.context.filter((x) => x.prescriberFlag === 1) : [];
          this.setState({
            productCategoryData: res.context ? res.context : [],
            loading: false,
            showConfig: needPrescriberCategory.length > 0
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          loading: false
        });
      });
  }
  savePrescriberSetting() {
    this.setState({
      buttonLoadding: true
    });
    const { listSystemConfig, productCategoryData } = this.state;
    let prescriberConfigs = [];
    let orderConfigs = [];
    productCategoryData.map((item) => {
      prescriberConfigs.push({ cateId: item.cateId, prescriberFlag: item.prescriberFlag });
    });
    listSystemConfig.map((item) => {
      orderConfigs.push({ id: item.id, status: item.status });
    });
    webapi
      .savePrescrberSettting(prescriberConfigs, orderConfigs)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Save successfully');
          this.setState({
            buttonLoadding: false
          });
          this.getListSystemConfig();
          this.getProductCategory();
        } else {
          message.error(res.message || 'Save Failed');
          this.setState({
            buttonLoadding: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Save Failed');
        this.setState({
          buttonLoadding: false
        });
      });
  }
  onChange = ({ field, value }) => {
    const { listSystemConfig } = this.state;
    listSystemConfig.map((item) => {
      if (item.configType === field) {
        item.status = value;
      }
      return item;
    });
    this.setState({
      listSystemConfig
    });
  };
  onChangeNeedPrescriber(cateId, checked) {
    const { productCategoryData, listSystemConfig } = this.state;
    productCategoryData.map((item) => {
      if (item.cateId === cateId) {
        item.prescriberFlag = checked ? 1 : 0;
      }
      return item;
    });
    this.setState(
      {
        productCategoryData
      },
      () => {
        let needPrescriberCategory = productCategoryData ? productCategoryData.filter((x) => x.prescriberFlag === 1) : [];
        if (needPrescriberCategory.length === 0) {
          listSystemConfig.map((item) => {
            item.status = 0;
          });
          this.setState({
            listSystemConfig,
            showConfig: false
          });
        } else {
          this.setState({ showConfig: true });
        }
      }
    );
  }
  render() {
    const { listSystemConfig, selectType, ifPrescriberMandatory, buttonLoadding, showConfig } = this.state;
    let columns = [
      {
        title: 'Category',
        dataIndex: 'cateName',
        key: 'cateName'
      },
      {
        title: 'Parent Category',
        dataIndex: 'parentCateName',
        key: 'parentCateName'
      },
      {
        title: 'Need Prescriber',
        dataIndex: 'prescriberFlag',
        key: 'prescriberFlag',
        render: (text, record) => {
          return <Switch checked={text === 1 ? true : false} onChange={(checked) => this.onChangeNeedPrescriber(record.cateId, checked)}></Switch>;
        }
      }
    ];
    let selectionType = listSystemConfig.find((x) => x.configType === selectType);
    let prescriberMandatory = listSystemConfig.find((x) => x.configType === ifPrescriberMandatory);
    return (
      <div>
        <BreadCrumb />
        <div className="container-search" id="prescrberSetting">
          <Headline title="Prescriber Setting" />
          <Row className="tipBox">Please select the product category to be reviewed.</Row>
          <Row>
            <span className="ant-form-item-required">Sigase category 4 categories have been signed then maximum is 20 categories</span>
          </Row>
          <Row>
            <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
              <Table rowKey="cateId" pagination={false} dataSource={this.state.productCategoryData} columns={columns} />
            </Spin>
          </Row>
          {showConfig ? (
            <div>
              <Row>
                <Col span={6}>Selection Type</Col>
                <Col span={18}>
                  <Radio.Group
                    value={selectionType ? selectionType.status : null}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onChange({
                        field: selectType,
                        value
                      });
                    }}
                  >
                    <Radio value={0}>Prescriber Map</Radio>
                    <Radio value={1}>Recommendation Code</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <Row>
                <Col span={6}>If prescriber is not mandatory</Col>
                <Col span={18}>
                  <Switch
                    onChange={(checked) => {
                      this.onChange({
                        field: ifPrescriberMandatory,
                        value: checked ? 1 : 0
                      });
                    }}
                    checked={prescriberMandatory ? (prescriberMandatory.status === 1 ? true : false) : null}
                  ></Switch>
                </Col>
              </Row>
            </div>
          ) : null}

          <Row>
            <Col span={12}>
              <Button loading={buttonLoadding} type="primary" onClick={() => this.savePrescriberSetting()}>
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
