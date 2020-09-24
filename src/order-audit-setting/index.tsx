import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, AuthWrapper } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tag,
  message,
  Select,
  Radio,
  DatePicker,
  Spin,
  Alert,
  InputNumber
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Audit Setting',

      isAudit: false,
      isPetInfo: false,

      configForm: {
        autoAuditId: 0,
        manualAuditId: 0,
        petInfoId: 0
      },

      visibleAuditConfig: false,
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
            let isAudit = false;
            let isPetInfo = false;
            for (let i = 0; i < configList.length; i++) {
              if (
                configList[i].configType &&
                configList[i].configType === 'no_audit_required'
              ) {
                configForm.autoAuditId = configList[i].id;
                isAudit = configList[i].status === 1 ? false : true;
              }
              if (
                configList[i].configType &&
                configList[i].configType ===
                  'audit_according_to_product_category'
              ) {
                configForm.manualAuditId = configList[i].id;
              }
              if (
                configList[i].configType &&
                configList[i].configType === 'pet_information_as_reference'
              ) {
                configForm.petInfoId = configList[i].id;
                isPetInfo = configList[i].status === 0 ? false : true;
              }
            }
            this.setState({
              isAudit,
              isPetInfo,
              configForm,
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Get config failed');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err || 'Get config failed');
      });
  };
  save = () => {
    const { configForm, isAudit, isPetInfo } = this.state;
    let params = {
      requestList: [
        {
          id: configForm.autoAuditId,
          status: isAudit ? 0 : 1
        },
        {
          id: configForm.manualAuditId,
          status: isAudit ? 1 : 0
        },
        {
          id: configForm.petInfoId,
          status: isPetInfo ? 1 : 0
        }
      ]
    };
    webapi
      .saveAuditConfig(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Save successful');
        } else {
          message.error(res.message || 'Save config failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Save config failed');
      });
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
          message.error(res.message || 'Get goods category failed!');
        }
      })
      .catch((err) => {
        this.setState({
          categoryLoading: false
        });
        message.error(err || 'Get goods category failed!');
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
          message.success(res.message || 'Update successful');
        } else {
          this.setState({
            categoryLoading: false
          });
          message.error(res.message || 'Update failed');
        }
      })
      .catch((err) => {
        this.setState({
          categoryLoading: false
        });
        message.error(err || 'Update failed');
      });
  };

  render() {
    const {
      title,
      isAudit,
      isPetInfo,
      configForm,
      visibleAuditConfig,
      configData,
      categoryLoading
    } = this.state;
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
        title: 'Category',
        dataIndex: 'parentCateName',
        key: 'parentCateName',
        width: '33%'
      },
      {
        title: 'Superior category',
        dataIndex: 'cateName',
        key: 'cateName',
        width: '33%'
      },

      {
        title: 'Need audit',
        dataIndex: 'status',
        key: 'status',
        width: '33%',
        render: (text, record) => (
          <Switch
            checked={record.status}
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

    return (
      <AuthWrapper functionName="f_order_audit_setting">
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Spin spinning={this.state.loading}>
            <Form layout="horizontal" {...formItemLayout} labelAlign="left">
              <FormItem label="Auto audit">
                <Switch
                  size="small"
                  checked={!isAudit}
                  onClick={(checked) => {
                    this.setState({
                      isAudit: !checked,
                      visibleAuditConfig: !checked,
                      isPetInfo: false
                    });
                  }}
                ></Switch>
              </FormItem>
              <FormItem label="Manual audit">
                <Switch
                  size="small"
                  checked={isAudit}
                  onClick={(checked) => {
                    this.setState({
                      isAudit: checked,
                      visibleAuditConfig: checked,
                      isPetInfo: false
                    });
                  }}
                ></Switch>
                {isAudit ? (
                  <Tooltip placement="top" title="Edit">
                    <a
                      onClick={() => {
                        this.setState({
                          visibleAuditConfig: true
                        });
                      }}
                      style={{ marginLeft: 10 }}
                      href="javascript:void(0)"
                      className="iconfont iconEdit"
                    ></a>
                  </Tooltip>
                ) : null}
              </FormItem>
              <FormItem label="Pet information as a reference">
                <Switch
                  size="small"
                  disabled={!isAudit}
                  checked={isPetInfo}
                  onClick={(checked) => {
                    this.setState({
                      isPetInfo: checked
                    });
                  }}
                ></Switch>
              </FormItem>
            </Form>
          </Spin>
        </div>
        <Modal
          width="800px"
          title="Please select the product category to be reviewed."
          visible={visibleAuditConfig}
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
            Signed category 2 categories have been signed then maximum is 200
            categories
          </p>
          <Table
            loading={categoryLoading}
            rowKey="id"
            columns={columns}
            dataSource={configData}
            pagination={false}
          ></Table>
        </Modal>
        <div className="bar-button">
          <Button
            type="primary"
            shape="round"
            style={{ marginRight: 10 }}
            onClick={() => this.save()}
          >
            {<FormattedMessage id="save" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(OrderSetting);
