import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, AuthWrapper } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="OrderAuditSetting.AuditSetting" />,
      auditMethod: '',
      isPetInfo: false,

      configForm: {
        autoAuditId: 0,
        manualAuditId: 0,
        petInfoId: 0
      },

      visibleAuditConfig: false,
      visiblePrescriberConfig: false,
      configData: [],
      loading: false,
      categoryLoading: false
    };
  }
  componentDidMount() {
    this.getAuditConfig();
    this.getGoodsCategory();
  }

  configFormChange = ({ field, value }) => {
    const { configForm } = this.state;
    configForm[field] = value;
    this.setState({
      configForm
    });
  };

  getAuditConfig = () => {
    this.setState({
      loading: true
    });
    webapi
      .getAuditConfig()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let configList = res.context;
          if (configList) {
            const { configForm } = this.state;
            let isPetInfo = false;
            let auditMethod = null;
            for (let i = 0; i < configList.length; i++) {
              if (configList[i].configType && configList[i].configType === 'no_audit_required') {
                configForm.autoAuditId = configList[i].id;
                //判断自动审核是否开启
                auditMethod = configList[i].status === 1 ? <FormattedMessage id="OrderAuditSetting.AutoAudit" /> : <FormattedMessage id="OrderAuditSetting.ManualAudit" />;
              }
              if (configList[i].configType && configList[i].configType === 'audit_according_to_product_category') {
                configForm.manualAuditId = configList[i].id;
              }
              if (configList[i].configType && configList[i].configType === 'pet_information_as_reference') {
                configForm.petInfoId = configList[i].id;
                isPetInfo = configList[i].status === 0 ? false : true;
              }
            }
            this.setState({
              auditMethod,
              isPetInfo,
              configForm,
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  save = (params) => {
    webapi
      .saveAuditConfig(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="OrderAuditSetting.OperateSuccessfully" />);
        }
      })
      .catch((err) => {});
  };
  getGoodsCategory = () => {
    webapi
      .getGoodsCategory()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            configData: res.context,
            categoryLoading: false
          });
        } else {
          this.setState({
            categoryLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          categoryLoading: false
        });
      });
  };
  updateCategoryStatus = (params) => {
    this.setState({
      categoryLoading: true
    });
    webapi
      .updateCategoryStatus(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getGoodsCategory();
          message.success(<FormattedMessage id="OrderAuditSetting.OperateSuccessfully" />);
        } else {
          this.setState({
            categoryLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          categoryLoading: false
        });
      });
  };

  updateCategoryPrescriber = (params) => {
    this.setState({
      categoryLoading: true
    });
    webapi
      .updateCategoryPrescriber(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getGoodsCategory();
          message.success(<FormattedMessage id="OrderAuditSetting.OperateSuccessfully" />);
        } else {
          this.setState({
            categoryLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          categoryLoading: false
        });
      });
  };

  onAuditMethodChange = (e) => {
    const { configForm, isPetInfo } = this.state;

    if (e.target.value === 'Auto audit') {
      this.setState({
        auditMethod: e.target.value,
        visiblePrescriberConfig: true,
        isPetInfo: false
      });

      let params = {
        requestList: [
          {
            id: configForm.autoAuditId,
            status: 1
          },
          {
            id: configForm.manualAuditId,
            status: 0
          },
          {
            id: configForm.petInfoId,
            status: 0
          }
        ]
      };
      this.save(params);
    }
    if (e.target.value === 'Manual audit') {
      this.setState({
        auditMethod: e.target.value,
        visibleAuditConfig: true
      });
      let params = {
        requestList: [
          {
            id: configForm.autoAuditId,
            status: 0
          },
          {
            id: configForm.manualAuditId,
            status: 1
          },
          {
            id: configForm.petInfoId,
            status: isPetInfo ? 1 : 0
          }
        ]
      };
      this.save(params);
    }
  };
  onPetInfoChange = (checked) => {
    const { configForm } = this.state;
    this.setState({
      isPetInfo: checked ? 1 : 0
    });
    let params = {
      requestList: [
        {
          id: configForm.autoAuditId,
          status: 0
        },
        {
          id: configForm.manualAuditId,
          status: 1
        },
        {
          id: configForm.petInfoId,
          status: checked ? 1 : 0
        }
      ]
    };
    this.save(params);
  };

  render() {
    const { title, auditMethod, isPetInfo, configForm, visibleAuditConfig, visiblePrescriberConfig, configData, categoryLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const columns = [
      {
        title: <FormattedMessage id="OrderAuditSetting.Category" />,
        dataIndex: 'parentCateName',
        key: 'parentCateName',
        width: '33%'
      },
      {
        title: <FormattedMessage id="OrderAuditSetting.ParentCategory" />,
        dataIndex: 'cateName',
        key: 'cateName',
        width: '33%'
      },

      {
        title: <FormattedMessage id="OrderAuditSetting.NeedAudit" />,
        dataIndex: 'status',
        key: 'status',
        width: '33%',
        render: (text, record) => (
          <Switch
            checked={+record.status ? true : false}
            onClick={(checked) => {
              let params = {
                cateId: record.cateId,
                status: checked ? 1 : 0
              };
              this.updateCategoryStatus(params);
            }}
          ></Switch>
        )
      }
    ];

    const columnsPresciber = [
      {
        title: <FormattedMessage id="OrderAuditSetting.Category" />,
        dataIndex: 'parentCateName',
        key: 'parentCateName',
        width: '33%'
      },
      {
        title: <FormattedMessage id="OrderAuditSetting.ParentCategory" />,
        dataIndex: 'cateName',
        key: 'cateName',
        width: '33%'
      },

      {
        title: <FormattedMessage id="OrderAuditSetting.NeedPrescriber" />,
        dataIndex: 'prescriberFlag',
        key: 'prescriberFlag',
        width: '33%',
        render: (text, record) => (
          <Switch
            checked={+record.prescriberFlag ? true : false}
            onClick={(checked) => {
              let params = {
                cateId: record.cateId,
                prescriberFlag: checked ? 1 : 0
              };
              this.updateCategoryPrescriber(params);
            }}
          ></Switch>
        )
      }
    ];

    return (
      <AuthWrapper functionName="f_order_audit_setting">
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <div style={{ margin: 20 }}>
              <span style={{ marginRight: 20 }}>
                <FormattedMessage id="OrderAuditSetting.AuditMethod" />:
              </span>
              <Radio.Group onChange={this.onAuditMethodChange} value={auditMethod}>
                <Radio value="Auto audit">
                  <FormattedMessage id="OrderAuditSetting.AutoAudit" />
                </Radio>
                {auditMethod === 'Auto audit' ? (
                  <Tooltip placement="top" title={<FormattedMessage id="OrderAuditSetting.Edit" />}>
                    <span
                      onClick={() => {
                        this.setState({
                          visiblePrescriberConfig: true
                        });
                      }}
                      style={{ marginRight: 10, color: '#e2001a' }}
                      className="iconfont iconEdit"
                    ></span>
                  </Tooltip>
                ) : null}
                <Radio value="Manual audit">
                  <FormattedMessage id="OrderAuditSetting.ManualAudit" />
                </Radio>
                {auditMethod === 'Manual audit' ? (
                  <Tooltip placement="top" title={<FormattedMessage id="OrderAuditSetting.Edit" />}>
                    <span
                      onClick={() => {
                        this.setState({
                          visibleAuditConfig: true
                        });
                      }}
                      style={{ marginRight: 10, color: '#e2001a' }}
                      className="iconfont iconEdit"
                    ></span>
                  </Tooltip>
                ) : null}
              </Radio.Group>
            </div>
          </Spin>
        </div>
        {/* prescriber */}
        <Modal
          width="800px"
          title={<FormattedMessage id="OrderAuditSetting.SelectRequiresPrescriber" />}
          visible={visiblePrescriberConfig}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  visiblePrescriberConfig: false
                });
              }}
            >
              <FormattedMessage id="OrderAuditSetting.Close" />
            </Button>
          ]}
          onOk={() => {
            this.setState({
              visiblePrescriberConfig: false
            });
          }}
          onCancel={() => {
            this.setState({
              visiblePrescriberConfig: false
            });
          }}
        >
          <Table loading={categoryLoading} rowKey="id" columns={columnsPresciber} dataSource={configData} pagination={false}></Table>
          <div style={{ marginTop: 20 }}>
            <span style={{ marginRight: 20 }}>
              <FormattedMessage id="OrderAuditSetting.PetInformationAs" />
            </span>
            <Switch size="small" disabled={true} checked={isPetInfo}></Switch>
          </div>
        </Modal>
        {/* audit */}
        <Modal
          width="800px"
          title={<FormattedMessage id="OrderAuditSetting.selectBeReviewed" />}
          visible={visibleAuditConfig}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  visibleAuditConfig: false
                });
              }}
            >
              <FormattedMessage id="OrderAuditSetting.Close" />
            </Button>
          ]}
          onOk={() => {
            this.setState({
              visibleAuditConfig: false
            });
          }}
          onCancel={() => {
            this.setState({
              visibleAuditConfig: false
            });
          }}
        >
          <p>
            <span
              style={{
                color: 'red',
                fontFamily: 'SimSun',
                marginRight: '4px',
                fontSize: '12px'
              }}
            >
              *
            </span>
            {<FormattedMessage id="OrderAuditSetting.SignedCategory" />}
            {configData.length}
            {<FormattedMessage id="OrderAuditSetting.categoriesHave" />}
          </p>
          <Table loading={categoryLoading} rowKey="id" columns={columns} dataSource={configData} pagination={false}></Table>
          <div style={{ marginTop: 20 }}>
            <span style={{ marginRight: 20 }}>
              <FormattedMessage id="OrderAuditSetting.PetInformation" />:
            </span>
            <Switch size="small" disabled={false} checked={isPetInfo} onClick={(checked) => this.onPetInfoChange(checked)}></Switch>
          </div>
        </Modal>

        {/* <div className="bar-button">
          <Button type="primary" shape="round" style={{ marginRight: 10 }} onClick={() => this.save()}>
            {<FormattedMessage id="save" />}
          </Button>
        </div> */}
      </AuthWrapper>
    );
  }
}

export default Form.create()(OrderSetting);
