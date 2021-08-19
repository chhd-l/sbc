import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Table, Tooltip, Switch, Modal, Button, Form, message, Spin, Checkbox } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import './index.less';

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Order.AuditSetting" />,
      visibleAuditConfig: false,
      configData: [],
      loading: false,
      categoryLoading: false,
      isAutoAudit: false, //是否开启订单自动审核
      ExceptCondition1: false, //Orders with 0 price
      ExceptCondition2: false, //Product categories
      ExceptCondition3: false //A pet owner placed more than 5 orders on a day
    };
  }

  componentDidMount() {
    this.getAuditConfig();
    this.getGoodsCategory();
  }

  //获取audit setting配置
  getAuditConfig = () => {
    this.setState({
      loading: true
    });
    webapi
      .getAuditConfig()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let auditConfigList = (res?.context || []).find((item) => {
            if (item.configType === 'no_audit_required') {
              return item;
            }
          });
          if (auditConfigList) {
            let auditConfigContext = JSON.parse(auditConfigList?.context);
            auditConfigContext.map((item) => {
              const name =
                item.name === 'Orders with 0 price'
                  ? 'ExceptCondition1'
                  : item.name === 'Product categories'
                  ? 'ExceptCondition2'
                  : 'ExceptCondition3';
              this.setState({ [name]: +item.state });
            });
            this.setState({ isAutoAudit: +auditConfigList.state });
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        this.setState({
          loading: false
        });
      });
  };

  //获取Product Category
  getGoodsCategory = () => {
    webapi
      .getGoodsCategory()
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          this.setState({
            configData: data.res.context
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        this.setState({
          categoryLoading: false
        });
      });
  };

  //更新Product Category audit status
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
          message.success(<FormattedMessage id="Order.OperateSuccessfully" />);
        }
      })
      .catch((err) => {})
      .finally(() => {
        this.setState({
          categoryLoading: false
        });
      });
  };

  //发送更新audit setting的请求
  updateAuditSetting = () => {
    const { ExceptCondition1, ExceptCondition2, ExceptCondition3, isAutoAudit } = this.state;
    let params = {
      requestList: [
        {
          id: 'no_audit_required',
          status: isAutoAudit ? 1 : 0
        },
        {
          id: 'Orders with 0 price',
          status: ExceptCondition1 ? 1 : 0
        },
        {
          id: 'Product categories',
          status: ExceptCondition2 ? 1 : 0
        },
        {
          id: 'A pet owner placed more than 5 orders on a day',
          status: ExceptCondition3 ? 1 : 0
        }
      ]
    };
    webapi
      .saveAuditConfig(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="Order.OperateSuccessfully" />);
        }
      })
      .catch((err) => {})
      .finally(() => {
        this.getAuditConfig();
      });
  };

  //audit setting change
  onAuditSettingChange = (state, value) => {
    this.setState({ [state]: value }, () => {
      this.updateAuditSetting();
    });
    if (state === 'ExceptCondition2') {
      this.setState({ visibleAuditConfig: true });
    }
  };

  //打开product category modal
  openCategoryModal = () => {
    this.setState({ visibleAuditConfig: true });
  };

  //关闭product category modal
  closeCategoryModal = () => {
    this.setState({ visibleAuditConfig: false });
  };

  render() {
    const {
      title,
      visibleAuditConfig,
      configData,
      categoryLoading,
      isAutoAudit,
      ExceptCondition1,
      ExceptCondition2,
      ExceptCondition3
    } = this.state;

    const columns = [
      {
        title: <FormattedMessage id="Order.Category" />,
        dataIndex: 'parentCateName',
        key: 'parentCateName',
        width: '33%'
      },
      {
        title: <FormattedMessage id="Order.ParentCategory" />,
        dataIndex: 'cateName',
        key: 'cateName',
        width: '33%'
      },

      {
        title: <FormattedMessage id="Order.NeedAudit" />,
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
          />
        )
      }
    ];

    return (
      <AuthWrapper functionName="f_order_audit_setting">
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Spin
            spinning={this.state.loading}
            indicator={
              <img
                className="spinner"
                src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
                style={{ width: '90px', height: '90px' }}
                alt=""
              />
            }
          >
            <div style={{ margin: 20 }}>
              <div className="flex flex-row justify-start items-center">
                <p style={{ marginRight: 20, width: 140 }}>
                  <FormattedMessage id="Order.orderAutoAudit" />
                </p>
                <Switch
                  checked={isAutoAudit}
                  onChange={(e) => this.onAuditSettingChange('isAutoAudit', e)}
                />
              </div>

              {isAutoAudit ? (
                <div>
                  <div className="mt-20 flex flex-row items-center">
                    <span className="span-important">*</span>
                    <span>
                      <FormattedMessage id="Order.autoAuditExceptConditionTip1" />
                      &nbsp;
                    </span>
                    <span style={{ textDecoration: 'underline' }}>
                      <FormattedMessage id="Order.autoAuditExceptConditionTip2" />
                    </span>
                    <span>&nbsp;:</span>
                  </div>
                  <div className="flex flex-row justify-start items-center mt-20 ml-20">
                    <Checkbox
                      checked={ExceptCondition1}
                      onChange={(e) =>
                        this.onAuditSettingChange('ExceptCondition1', e.target.checked)
                      }
                    />
                    <div className="ml-20">
                      <FormattedMessage id="Order.autoAuditExceptCondition1" />
                    </div>
                  </div>
                  <div className="flex flex-row justify-start items-center mt-20 ml-20">
                    <Checkbox
                      checked={ExceptCondition2}
                      onChange={(e) =>
                        this.onAuditSettingChange('ExceptCondition2', e.target.checked)
                      }
                    />
                    <div className="ml-20">
                      <FormattedMessage id="Order.autoAuditExceptCondition2" />
                    </div>
                    {ExceptCondition2 ? (
                      <Tooltip placement="top" title={<FormattedMessage id="Order.Edit" />}>
                        <span
                          onClick={() => this.openCategoryModal()}
                          style={{ color: '#e2001a' }}
                          className="iconfont iconEdit ml-20"
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                  <div className="flex flex-row justify-start items-center mt-20 ml-20">
                    <Checkbox
                      checked={ExceptCondition3}
                      onChange={(e) =>
                        this.onAuditSettingChange('ExceptCondition3', e.target.checked)
                      }
                    />
                    <div className="ml-20">
                      <FormattedMessage id="Order.autoAuditExceptCondition3" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Spin>
        </div>
        {/* product category */}
        <Modal
          width="800px"
          title={<FormattedMessage id="Order.selectBeReviewed" />}
          visible={visibleAuditConfig}
          footer={[
            <Button key="back" onClick={() => this.closeCategoryModal()}>
              <FormattedMessage id="Order.Close" />
            </Button>
          ]}
          onOk={() => this.closeCategoryModal()}
          onCancel={() => this.closeCategoryModal()}
        >
          <p>
            <span className="span-important">*</span>
            <FormattedMessage id="Order.SignedCategory" />
            {` ${configData.length} `}
            <FormattedMessage id="Order.categoriesHave" />
          </p>
          <Table
            loading={categoryLoading}
            rowKey="id"
            columns={columns}
            dataSource={configData}
            pagination={false}
          />
        </Modal>
      </AuthWrapper>
    );
  }
}

export default Form.create()(OrderSetting);
