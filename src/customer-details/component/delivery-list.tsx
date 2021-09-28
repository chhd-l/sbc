import React from 'react';
import { Table, Popconfirm, Button, Radio, Tooltip, Tag, Modal, message, Row, Col, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, RCi18n, Const } from 'qmkit';
import * as webapi from './webapi';
import { getAddressListByType, addAddress, updateAddress, defaultAddress, delAddress } from '../webapi';
import PickupDelivery from './pickup-delivery'
import { PostalCodeMsg } from 'biz';


interface Iprop {
  customerId: string;
  type: 'DELIVERY' | 'BILLING';
  onEdit?: Function;
}

const NEW_ADDRESS_TEMPLATE = {
  firstName: '',
  lastName: '',
  consigneeNumber: '',
  postCode: '',
  countryId: null,
  region: '',
  province: '',
  city: '',
  address1: '',
  address2: '',
  entrance: '',
  apartment: '',
  rfc: ''
};

export default class DeliveryList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      pickupIsOpen: false, // pickup开关
      list: [],
      homeDeliveryList: [],
      selectAddressId: '',
      confirmPickupDisabled: true, // pickup地址确认按钮状态

      countryArr: [],
      pickupList: [],
      addOrEditPickup: false,
      defaultCity: '',
      pickupEditNumber: 0,
      pickupFormData: [], // pickup 表单数据
    };
  }

  async componentDidMount() {
    this.getAddressList();

    const countryArr = await webapi.getCountryList();
    this.setState({
      countryArr
    });

    let pickupIsOpen = JSON.parse(sessionStorage.getItem('portal-pickup-isopen')) || null;
    if (pickupIsOpen) {
      this.setState({
        pickupIsOpen
      })
    }
  }
  // 读取地址列表
  getAddressList = () => {
    this.setState({
      loading: true
    });
    getAddressListByType(this.props.customerId, this.props.type)
      .then((data) => {
        let list = data.res.context.customerDeliveryAddressVOList;
        let hdList = list.filter((e: any) => e.receiveType !== 'PICK_UP');
        let pkList = list.filter((e: any) => e.receiveType === 'PICK_UP');
        this.setState({
          loading: false,
          list,
          homeDeliveryList: hdList,
          pickupList: pkList,
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };
  // 设置默认地址
  setDefaultAddress = (item: any) => {
    defaultAddress({ customerId: item.customerId, deliveryAddressId: item.deliveryAddressId })
      .then((data) => {
        this.getAddressList();
      })
      .catch(() => { });
  }
  // 删除地址
  onDeleteAddress = (id: string) => {
    this.setState({
      loading: true
    });
    delAddress(id)
      .then((data) => {
        this.getAddressList();
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  // 修改pickup address
  updatePickupAddress = (params: any) => {
    updateAddress(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.getAddressList();
          message.success(RCi18n({ id: "PetOwner.OperateSuccessfully" }));
        } else {
          message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
        }
        this.setState({
          addOrEditPickup: false,
          pickupLoading: false
        });
      })
      .catch((err) => {
        message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
        this.setState({
          addOrEditPickup: false,
          pickupLoading: false
        });
      });
  };

  // 保存pickup地址
  pickupConfirm = async () => {
    const { customerId } = this.props;
    const { homeDeliveryList, pickupList, pickupFormData, countryArr } = this.state;

    let tempPickup = Object.keys(homeDeliveryList[0]).reduce((pre, cur) => {
      return Object.assign(pre, { [cur]: '' });
    }, {});

    let params = Object.assign(tempPickup, pickupFormData, {
      customerId: customerId,
      deliveryAddressId: pickupList[0]?.deliveryAddressId || '',
      countryId: countryArr[0].id,
      country: countryArr[0].value,
      consigneeName: pickupFormData.firstName + ' ' + pickupFormData.lastName,
      consigneeNumber: pickupFormData.phoneNumber,
      deliveryAddress: pickupFormData.address1,
      type: 'DELIVERY',
      isDefaltAddress: pickupFormData.isDefaltAddress ? 1 : 0,
    });
    this.setState({
      pickupLoading: true
    });
    if (pickupList.length) {
      // 修改地址
      await this.updatePickupAddress(params);
    } else {
      // 添加地址
      const { res } = await addAddress({
        ...params,
        customerId
      });
      if (res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({ id: "PetOwner.OperateSuccessfully" }));
      } else {
        message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
      }
      this.setState({
        addOrEditPickup: false,
        pickupLoading: false
      }, () => {
        this.getAddressList();
      });
    }
  }
  // 更新 pickup编辑次数
  updatePickupLoading = (flag: boolean) => {
    this.setState({
      pickupLoading: flag
    });
  };
  // 更新 pickup编辑次数
  updatePickupEditNumber = (num: number) => {
    this.setState({
      pickupEditNumber: num
    });
  };

  // 更新pickup数据
  updatePickupData = (data) => {
    this.setState({
      pickupFormData: data
    });
  };

  // 更新 pickup 按钮状态
  updateConfirmPickupDisabled = (flag: boolean) => {
    this.setState({
      confirmPickupDisabled: flag
    });
  };

  render() {
    const {
      loading,
      pickupIsOpen,
      homeDeliveryList,
      selectAddressId,
      confirmPickupDisabled,

      pickupLoading,
      addOrEditPickup,
      defaultCity,
      pickupEditNumber,
      pickupList,
      pickupFormData
    } = this.state;
    const { onEdit } = this.props;
    let columns = [
      {
        title: RCi18n({ id: "PetOwner.ReceiverName" }),
        dataIndex: 'consigneeName',
        key: 'name'
      },
      {
        title: RCi18n({ id: "PetOwner.PhoneNumber" }),
        dataIndex: 'consigneeNumber',
        key: 'phone'
      },
      {
        title: RCi18n({ id: "PetOwner.PostalCode" }),
        dataIndex: 'postCode',
        key: 'postcode',
        render: (text, record) => {
          if (!!record?.validFlag) {
            return <span>{text}</span>
          } else {
            return (
              <div style={{ color: '#e2001a' }}>
                <Tooltip overlayClassName='address-Tooltip-wrap' title={<PostalCodeMsg text={record?.alert} />}>
                  <span>{text}</span>
                </Tooltip>
              </div>
            )
          }
        },

      },
      {
        title: RCi18n({ id: "PetOwner.Address" }),
        dataIndex: 'address1',
        key: 'address'
      },
      {
        title: RCi18n({ id: "PetOwner.Default" }),
        dataIndex: 'isDefaltAddress',
        key: 'default',
        render: (text: any, record: any) => (
          <>
            {record.isDefaltAddress == 1 ? (
              <Tag style={{
                backgroundColor: 'none', border: '1px solid #e2001a', color: '#e2001a', borderColor: '#e2001a', overflow: 'hidden',
                padding: ' 5px 1.5rem', borderRadius: '999px'
              }}>
                <FormattedMessage id="PetOwner.Default" />
              </Tag>
            ) : (
              <>
                <Radio.Group
                  value={selectAddressId}
                  onChange={(e) => {
                    let value = e.target.value;
                    this.setState({
                      selectAddressId: value
                    }, () => {
                      this.setDefaultAddress(record);
                    });
                  }}
                >
                  {record.receiveType === 'PICK_UP' ? (
                    <Radio
                      value={record.deliveryAddressId}
                    />
                  ) : (
                    <Radio
                      disabled={!record.validFlag}
                      value={record.deliveryAddressId}
                    />
                  )}

                </Radio.Group>
              </>
            )}
          </>
        )
      }
    ];

    if (Const.SITE_NAME !== 'MYVETRECO') {
      columns.push({
        title: RCi18n({ id: "PetOwner.Operation" }),
        dataIndex: '',
        key: 'oper',
        render: (_, record) => (
          <div>
            {/* 编辑地址 */}
            <Tooltip title={RCi18n({ id: "PetOwner.Edit" })}>
              {record.receiveType === 'PICK_UP' ? (
                <Button type="link" size="small" onClick={() => {
                  this.setState({
                    addOrEditPickup: true,
                    defaultCity: record.city
                  });
                }}>
                  <i className="iconfont iconEdit"></i>
                </Button>
              ) : (
                <Button type="link" size="small" onClick={() => onEdit({ ...NEW_ADDRESS_TEMPLATE, ...record })}>
                  <i className="iconfont iconEdit"></i>
                </Button>
              )}
            </Tooltip>

            {/* 删除地址 */}
            {record.canDelFlag && <Popconfirm placement="topRight" title={RCi18n({ id: "PetOwner.DeleteThisItem" })} onConfirm={() => this.onDeleteAddress(record.deliveryAddressId)} okText={RCi18n({ id: "PetOwner.Confirm" })} cancelText={RCi18n({ id: "PetOwner.Cancel" })}>
              <Tooltip title={RCi18n({ id: "PetOwner.Delete" })}>
                <Button type="link" size="small">
                  <i className="iconfont iconDelete"></i>
                </Button>
              </Tooltip>
            </Popconfirm>}
          </div>
        )
      });
    }

    return (
      <div>
        {/* homeDelivery address */}
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ marginRight: '1rem', display: 'inline-block', fontSize: '18px' }}><FormattedMessage id="Subscription.HomeDelivery" /></h3>
          {Const.SITE_NAME !== 'MYVETRECO' && <Button type="primary" onClick={() => onEdit(NEW_ADDRESS_TEMPLATE)} style={{ marginBottom: 10 }}>
            <FormattedMessage id="Subscription.AddNew" />
          </Button>}
        </div>
        <Table
          rowKey="deliveryAddressId"
          loading={loading}
          columns={columns}
          dataSource={homeDeliveryList}
          pagination={false}
        />

        {/* pickup address */}
        {pickupIsOpen ? (
          <>
            <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              <h3 style={{ marginRight: '1rem', display: 'inline-block', fontSize: '18px' }}><FormattedMessage id="Subscription.PickupDelivery" /></h3>
              {pickupList.length ? null : (
                <Button type="primary" onClick={() => {
                  this.setState({
                    addOrEditPickup: true,
                    defaultCity: ''
                  });
                }}>
                  <FormattedMessage id="Subscription.AddNew" />
                </Button>
              )}
            </div>
            <Table
              rowKey="deliveryAddressId"
              columns={columns}
              dataSource={pickupList}
              pagination={false}
            />

            {/* pickup弹框 */}
            <Modal
              width={650}
              title={pickupList?.length ? RCi18n({ id: "Subscription.ChangePickup" }) : RCi18n({ id: "Subscription.AddPickup" })}
              visible={addOrEditPickup}
              confirmLoading={pickupLoading}
              okButtonProps={{ disabled: confirmPickupDisabled }}
              onOk={() => this.pickupConfirm()}
              okText={RCi18n({ id: "Subscription.SelectPickpoint" })}
              onCancel={() => {
                this.setState({
                  addOrEditPickup: false
                });
              }}
            >
              {addOrEditPickup ? (
                <Spin spinning={pickupLoading}>
                  <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: 10 }}>
                    <Col style={{ width: '100%' }}>
                      <PickupDelivery
                        key={defaultCity}
                        initData={pickupFormData}
                        pickupAddress={pickupList}
                        defaultCity={defaultCity}
                        updateConfirmPickupDisabled={this.updateConfirmPickupDisabled}
                        updatePickupLoading={this.updatePickupLoading}
                        updatePickupEditNumber={this.updatePickupEditNumber}
                        updateData={this.updatePickupData}
                        pickupEditNumber={pickupEditNumber}
                      />
                    </Col>
                  </Row>
                </Spin>
              ) : null}
            </Modal>
          </>
        ) : null}

      </div>
    );
  }
}
