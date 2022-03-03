import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Button, Select, message, Tooltip, Popconfirm, Modal, Row, Col } from 'antd';

import { Headline, BreadCrumb, Const, RCi18n, ValidConst } from 'qmkit';
import * as webapi from './webapi';
import TablePage from '../product-dictionary/component/table';


const { Option } = Select;

class ProductDictionary extends Component<any, any> {
  tableRef: any;

  constructor(props) {
    super(props);

    this.tableRef = React.createRef();

    this.state = {
      type: '',
      email: '',
      message: '',
      periodTime: '',
      errorMessage: '',
      modalVisible: false,
      modalLoading: false,
      updateLoading: false,
      times: [],
      firstItemDescription: ''
    };
  }

  componentDidMount() {
    this.getTimeEnums();
  }

  getTimeEnums = async () => {
    const { res } = await webapi.getEnums();
    if (res.code === Const.SUCCESS_CODE) {
      const items = Object.keys(res.context) || [];
      this.setState({
        times: items,
      })
    }
  }

  searchFunc = async (params) => {
    const { res } = await webapi.getBlockList(params);

    if (res.code === Const.SUCCESS_CODE) {
      const { total, last, customerEmailFiltrList } = res.context;
      this.setState({
        firstItemDescription: customerEmailFiltrList[0]?.description || '',
      })
      return { total, last, content: customerEmailFiltrList };
    } else {
      return false;
    }
  };

  handleSearch = (params) => {
    this.tableRef.current?.resetSearch(params);
  };

  handleRefresh = () => {
    this.tableRef.current?.search();
  };

  handleAdd = () => {
    const {times, firstItemDescription} = this.state;
    this.setState({
      type: '',
      email: '',
      periodTime: times[0],
      description: firstItemDescription,
      errorMessage: '',
      modalVisible: true
    });
  };

  handleEdit = () => {
    const {firstItemDescription} = this.state;
    this.setState({
      type: 'desc',
      description: firstItemDescription,
      errorMessage: '',
      modalVisible: true
    });
  };

  handleUpdate = () => {
    const { type } = this.state;

    if (!type) {
      // new email
      this.addEmail();
    } else {
      // new error message
      this.addDescription();
    }
  };

  addEmail = async () => {
    const { email, periodTime, description } = this.state;

    this.setState({
      updateLoading: true
    });

    const { res } = await webapi.addBlockEmail({
      name: email,
      timeType: periodTime,
      description,
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
      this.setState({
        modalVisible: false
      });
      this.handleRefresh();
    }
    if (res.code === 'K-000001') {
      this.setState({
        errorMessage: RCi18n({ id: 'PetOwner.EmailExist' })
      });
    }
    this.setState({
      updateLoading: false
    });
  };

  addDescription = async () => {
    const { description } = this.state;

    this.setState({
      updateLoading: true
    });

    const { res } = await webapi.updateBlockMessage({
      description
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
      this.setState({
        modalVisible: false
      });
      this.handleRefresh();
    }

    this.setState({
      updateLoading: false
    });
  };

  handleDelete = async (id) => {
    const { res } = await webapi.deleteBlock({
      idList: [id]
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.handleRefresh();
    }
  };

  handleChange = (key, value) => {
    if (key === 'email') {
      if (!ValidConst.email.test(value)) {
        this.setState({
          errorMessage: RCi18n({ id: 'PetOwner.theCorrectEmail' })
        });
      } else {
        this.setState({
          errorMessage: ''
        });
      }
    }

    this.setState({
      [key]: value
    });
  };

  render() {
    const { type, times, email, periodTime, description, errorMessage, modalVisible, modalLoading, updateLoading } = this.state;
    const columns = [
      {
        title: <FormattedMessage id='Survey.email' />,
        dataIndex: 'name'
      },
      {
        title: <FormattedMessage id='PetOwner.ValidPeriod' />,
        dataIndex: 'timeType'
      },
      {
        title: <FormattedMessage id='PetOwner.FromTo' />,
        dataIndex: 'range',
        render: (text, record) => (
          <div>
            <p>{record.timeHorizonStart ? record.timeHorizonStart.split('.')[0] : '' }</p>
            <p>{record.timeHorizonEnd ? record.timeHorizonEnd.split('.')[0] : record.timeType}</p>
          </div>
        )
      },
      {
        title: <FormattedMessage id='Product.Operation' />,
        dataIndex: 'operation',
        width: '180px',
        render: (text, record) => (
          <span>
            <Popconfirm placement='topLeft' title={`${RCi18n({ id: 'Setting.Areyousuretodelete' })}`}
                        onConfirm={() => this.handleDelete(record.id)}
                        okText={(window as any).RCi18n({ id: 'Setting.Confirm' })}
                        cancelText={(window as any).RCi18n({ id: 'Setting.Cancel' })}>
              <Tooltip placement='top' title={`${RCi18n({ id: 'Setting.Delete' })}`}>
                <a type='link' className='iconfont iconDelete' />
              </Tooltip>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <div>
        <BreadCrumb />

        <div className='container-search'>
          <Headline title={`${RCi18n({ id: 'Menu.Pet owner blocklist' })}`} />

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button type='primary' style={{ marginBottom: '10px' }} onClick={this.handleAdd}>
              <FormattedMessage id='PetOwner.AddBlocklist' />
            </Button>
            <Button type='primary' style={{ marginBottom: '10px' }} onClick={this.handleEdit}>
              <FormattedMessage id='PetOwner.EditErrorMessage' />
            </Button>
          </div>

        </div>

        <div className='container'>
          <TablePage
            ref={this.tableRef}
            initLoad={true}
            searchFunc={this.searchFunc}
            columns={columns}
          />
        </div>

        <Modal
          zIndex={1000}
          width='600px'
          title={!type ? RCi18n({ id: 'PetOwner.AddBlocklist' }) : RCi18n({ id: 'PetOwner.EditErrorMessage' })}
          visible={modalVisible}
          confirmLoading={modalLoading}
          maskClosable={false}
          onCancel={() =>
            this.setState({
              modalVisible: false
            })
          }
          footer={[
            <Button
              key='back'
              onClick={() => {
                this.setState({
                  modalVisible: false
                });
              }}
            >
              <FormattedMessage id='Product.Close' />
            </Button>,
            <Button
              type='primary'
              key='submit'
              loading={updateLoading}
              disabled={errorMessage || type && !description.trim() || !type && !email}
              onClick={this.handleUpdate}
            >
              <FormattedMessage id='Product.Submit' />
            </Button>
          ]}
        >
          <div style={{ padding: '60px 0' }}>
            {
              !type ? (
                <div>
                  <Row gutter={[24, 12]}>
                    <Col span={6} style={{ textAlign: 'right', color: '#333', lineHeight: '32px' }}>
                      <FormattedMessage id='PetOwner.Email' />:
                    </Col>
                    <Col span={14}>
                      <Input value={email} onChange={e => this.handleChange('email', e.target.value)} />
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col span={6} />
                    <Col span={14} style={{ color: '#e2001a' }}>
                      {errorMessage}
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col span={6} style={{ textAlign: 'right', color: '#333', lineHeight: '32px' }}>
                      <FormattedMessage id='PetOwner.ValidateUntil' />:
                    </Col>
                    <Col span={14}>
                      <Select value={periodTime} onChange={e => this.handleChange('periodTime', e)} style={{ width: '312px' }}>
                        {
                          times.map(time => (
                            <Option value={time} key={time}>{time}</Option>
                          ))
                        }
                      </Select>
                    </Col>
                  </Row>
                </div>
              ) : (
                <Row gutter={[24, 12]}>
                  <Col span={6} style={{ textAlign: 'right', color: '#333', lineHeight: '32px' }}>
                    <FormattedMessage id='Dashboard.Error Message' />:
                  </Col>
                  <Col span={14}>
                    <Input value={description} onChange={e => this.handleChange('description', e.target.value)} />
                  </Col>
                </Row>
              )
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(ProductDictionary);