import React from 'react';
import { Button, Col, Divider, message, Modal, Popconfirm, Row, Table, Tag, Tooltip } from 'antd';
import { deleteCard, getPaymentMethods } from '../webapi';
import { AuthWrapper, cache, RCi18n, Const } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { e } from 'mathjs';

interface Iprop {
  customerId: string;
  customerAccount: string;
}

export default class PaymentList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      visible: false,
      detailsList: [],
      paymentInfo: {}
    };
  }

  componentDidMount() {
    this.getCardList();
  }

  getCardList = () => {
    this.setState({ loading: true });
    const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA || '{}'));
    getPaymentMethods({
      customerId: this.props.customerId,
      storeId
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.sort((a, b) => b.isDefault - a.isDefault)
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  deleteCard = ({ id, canDelFlag }) => {
    if (!canDelFlag) {
      message.error(RCi18n({ id: 'PetOwner.cannotDeletePaymentCard' }));
      return;
    }
    this.setState({ loading: true });
    const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA || '{}'));
    deleteCard({ storeId, id })
      .then((data) => {
        if (data.res.code === 'K-100209') {
          message.error(data.res.message);
        } else {
          message.success(data.res.message);
          this.getCardList();
        }
      })
      .catch(() => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        this.setState({
          loading: false
        });
      });
  };

  handleDetails = (record) => {
    if (!record) return;
    let { bindCardLogs, bindCardRecord } = record;
    console.log('record', record)
    // console.log('bindCardLogs',bindCardLogs)
    // console.log('bindCardRecord',bindCardRecord)
    this.setState({
      detailsList: !!bindCardLogs ? bindCardLogs : [],
      paymentInfo: !!bindCardRecord ? bindCardRecord : {}
    });

    this.showModal();
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  getPaymentColumns = () => {
    return [
      {
        title: RCi18n({ id: 'PetOwner.EventType' }),
        dataIndex: 'eventType',
        key: 'eventType'
      },
      {
        title: RCi18n({ id: 'PetOwner.PspReference' }),
        dataIndex: 'pspReference',
        key: 'pspReference'
      },
      {
        title: RCi18n({ id: 'PetOwner.CollectionTime' }),
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: RCi18n({ id: 'PetOwner.Amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => {
          const tradePrice = text || 0;
          return `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} ${tradePrice.toFixed(2)}`;
        }
      },
      {
        title: RCi18n({ id: 'PetOwner.EventCode' }),
        dataIndex: 'eventCode',
        key: 'eventCode'
      },
      {
        title: RCi18n({ id: 'PetOwner.Result' }),
        dataIndex: 'result',
        key: 'result'
      },
      {
        title: RCi18n({ id: 'PetOwner.Remarks' }),
        dataIndex: 'remark',
        key: 'remark',
        render: (remark) => (
          <span>
            {remark ? (
              <Tooltip title={remark} placement="top">
                {remark}
              </Tooltip>
            ) : (
              '-'
            )}
          </span>
        )
      }
    ];
  };

  render() {
    const { list, loading, visible, detailsList, paymentInfo } = this.state;
    const customerId = this.props.customerId || '';
    const customerAccount = this.props.customerAccount || '';
    const columns = [
      {
        title: RCi18n({ id: 'PetOwner.CardNumber' }),
        dataIndex: 'lastFourDigits',
        key: 'cardno',
        render: (text, record) => {

          if (record.paymentItem?.toLowerCase() !== 'adyen_paypal') {
            switch (record.paymentItem?.toLowerCase()) {
              case 'adyen_ideal':
                return <div>
                  {record?.binNumber} {'BANK **** **** '} {record?.lastFourDigits}{' '}
                  {record.isDefault == 1 && (
                    <Tag color={Const.SITE_NAME === 'MYVETRECO' ? 'blue' : 'red'}>default</Tag>
                  )}
                </div>
                break;
              default:
                return <div>
                  {'**** **** **** ' + text}{' '}
                  {record.isDefault == 1 && (
                    <Tag color={Const.SITE_NAME === 'MYVETRECO' ? 'blue' : 'red'}>default</Tag>
                  )}
                </div>
                break;
            }

          } else {
            return <div>
              {text ? text.split('@')[0].substring(0, 4) + '***@' + text.split('@')[1] : ''}
              {record.isDefault == 1 && (
                <Tag color={Const.SITE_NAME === 'MYVETRECO' ? 'blue' : 'red'}>default</Tag>
              )}
            </div>
          }
        }
      },
      {
        title: RCi18n({ id: 'PetOwner.CardType' }),
        dataIndex: 'paymentVendor',
        key: 'type',
        render: (text, record) => {
          if (record?.paymentItem.toLowerCase() === 'adyen_credit_card') {
            return text
          } else {
            switch (record?.paymentItem) {
              case 'ADYEN_IDEAL':
                return record?.paymentItem.split('_')[1]
              default:
                return record?.paymentItem
            }
          }
        }
      },
      {
        title: RCi18n({ id: 'PetOwner.CardHolder' }),
        dataIndex: 'holderName',
        key: 'holder'
      },
      {
        title: RCi18n({ id: 'PetOwner.EmailAddress' }),
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: RCi18n({ id: 'PetOwner.phoneNumber' }),
        dataIndex: 'phone',
        key: 'phoneNumber'
      },
      {
        title: RCi18n({ id: 'PetOwner.Operation' }),
        key: 'oper',
        render: (_, record) => {
          return (
            <span>
              {Const.SITE_NAME !== 'MYVETRECO' && (
                <AuthWrapper functionName="f_create_credit_card">
                  <Popconfirm
                    placement="topRight"
                    title={RCi18n({ id: 'PetOwner.DeleteThisItem' })}
                    onConfirm={() => this.deleteCard(record)}
                    okText={RCi18n({ id: 'PetOwner.Confirm' })}
                    cancelText={RCi18n({ id: 'PetOwner.Cancel' })}
                  >
                    <Tooltip title={RCi18n({ id: 'PetOwner.Delete' })}>
                      <Button type="link">
                        <a className="iconfont iconDelete" />
                      </Button>
                    </Tooltip>
                    {record.paymentVendor.toLowerCase() == 'visa' && <Divider type="vertical" />}
                  </Popconfirm>
                </AuthWrapper>
              )}
              {record.paymentVendor.toLowerCase() == 'visa' && <a className="iconfont iconDetails" onClick={() => this.handleDetails(record)} />}
            </span>
          );
        }
      }
    ];
    const paypalColumns = [
      {
        title: RCi18n({ id: 'PetOwner.CardNumber' }),
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        render: (text, record) => (
          <div>
            {text ? text.split('@')[0].substring(0, 4) + '***@' + text.split('@')[1] : ''}
            {record.isDefault == 1 && (
              <Tag color={Const.SITE_NAME === 'MYVETRECO' ? 'blue' : 'red'}>default</Tag>
            )}
          </div>
        )
      },
      {
        title: RCi18n({ id: 'PetOwner.CardType' }),
        dataIndex: 'paymentVendor',
        key: 'type',
        width: '20%',
        render: (text, record) => (
          <div>
            <FormattedMessage id="Subscription.Paypal" />
          </div>
        )
      },
      {
        title: RCi18n({ id: 'PetOwner.Operation' }),
        key: 'oper',
        render: (_, record) => {
          return (
            <span>
              {Const.SITE_NAME !== 'MYVETRECO' && (
                <AuthWrapper functionName="f_create_credit_card">
                  <Popconfirm
                    placement="topRight"
                    title={RCi18n({ id: 'PetOwner.DeleteThisItem' })}
                    onConfirm={() => this.deleteCard(record)}
                    okText={RCi18n({ id: 'PetOwner.Confirm' })}
                    cancelText={RCi18n({ id: 'PetOwner.Cancel' })}
                  >
                    <Tooltip title={RCi18n({ id: 'PetOwner.Delete' })}>
                      <Button type="link">
                        <a className="iconfont iconDelete" />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </AuthWrapper>
              )}
            </span>
          );
        }
      }
    ];
    const detailsColumns = this.getPaymentColumns();

    return (
      <div>
        {Const.SITE_NAME !== 'MYVETRECO' && (
          <AuthWrapper functionName="f_create_credit_card">
            <Button type="primary">
              <Link to={`/credit-card/${customerId}/${customerAccount}`}>
                {RCi18n({ id: 'payment.add' })}
              </Link>
            </Button>
          </AuthWrapper>
        )}
        {/*credit cards*/}
        {/* <p
          style={{ margin: '10px 0', fontSize: '18px', fontWeight: 500, color: 'rgba(0, 0, 0, 1)' }}
        >
          <FormattedMessage id="PetOwner.creditCards" />
        </p> */}
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list.filter((el) => el.paymentItem?.toLowerCase() !== 'adyen_paypal')}
          pagination={false}
        />
        {/*paypal*/}
        {/* {JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId === 123457909 ? (
          <>
            <p
              style={{
                margin: '10px 0',
                fontSize: '18px',
                fontWeight: 500,
                color: 'rgba(0, 0, 0, 1)'
              }}
            >
              <FormattedMessage id="PetOwner.paypal" />
            </p>
            <Table
              rowKey="id"
              loading={loading}
              columns={paypalColumns}
              dataSource={list.filter((el) => el.paymentItem?.toLowerCase() === 'adyen_paypal')}
              pagination={false}
            />
          </>
        ) : null} */}

        <Modal width="75%" onCancel={this.closeModal} visible={visible} footer={null}>
          <div style={{ minHeight: 300, width: '100%', paddingTop: 25 }}>
            <Table
              rowKey="id"
              columns={detailsColumns}
              dataSource={detailsList}
              pagination={false}
            />
            <Row>
              <Col span={24} className="headBox" style={{ height: 200, marginTop: 10 }}>
                <h3>
                  <FormattedMessage id="Order.paymentDetails" />
                </h3>
                <Col span={24}>
                  <Row>
                    <Col span={12}>
                      <p>
                        {<FormattedMessage id="Order.cardHolderName" />}:{' '}
                        {paymentInfo.holderName || ''}
                      </p>
                      <p>
                        {<FormattedMessage id="Order.PSP" />}: {paymentInfo.pspName || ''}
                      </p>
                      <p>
                        {<FormattedMessage id="Order.cardType" />}:{' '}
                        {paymentInfo.paymentVendor || ''}
                      </p>
                      <p>
                        {<FormattedMessage id="Order.cardLast4Digits" />}:{' '}
                        {paymentInfo.lastFourDigits || ''}
                      </p>
                      <p>
                        {<FormattedMessage id="paymentId" />}: {paymentInfo.chargeId || ''}
                      </p>
                      <p>
                        {<FormattedMessage id="Order.phoneNumber" />}: {paymentInfo.phone || ''}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
