import React from 'react';
import { Headline, Const, AuthWrapper } from 'qmkit';
import { Radio, Button, Switch, Modal, Form, Input, Select, Tabs } from 'antd';
import SortFields from './sort-fields';
import { getAddressSetting } from '../../validation-setting/webapi';
import PostalCodeModal from '../component/PostalCodeModal';
import AddressSettingModal from '../component/AddressSettingModal';

const Option = Select.Option;
const INPUT_TYPE = [
  {
    key: 'inputFreeTextFlag',
    value: 'Free text'
  },
  {
    key: 'inputSearchBoxFlag',
    value: 'Search box'
  },
  {
    key: 'inputDropDownBoxFlag',
    value: 'Drop down'
  }
];

export default class Fields extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      field: {},
      apiName: '',
      isEditPostalCode: false,
      visiblePostalCode: false,
      isEditPostalCode2: false,
      visiblePostalCode2: false,
      visibleAddressSetting: false
    };
  }

  componentDidMount() {
    getAddressSetting().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        const apiNameId = data.res.context.addressApiSettings.find((item) => item.isOpen === 1)['id'] || 1;
        this.setState({
          apiName: apiNameId === 1 ? 'FGS' : apiNameId === 2 ? 'FedEx' : 'Dadata'
        });
      }
    });
  }

  onChangeField = (id: number, field: any) => {
    const { onFieldChange } = this.props;
    onFieldChange(id, field);
  };

  onOpenModal = (field: any) => {
    this.setState({
      visible: true,
      field: field
    });
  };

  onChangeModalField = (formField: any) => {
    const { field } = this.state;
    console.log('666 >>> formField: ', formField);
    this.setState({
      field: { ...field, ...formField }
    });
  };

  handleOk = () => {
    const { field } = this.state;
    this.onChangeField(field.id, field);
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  onSortManualEnd = (sortList) => {
    // this.setState({
    //   manu
    // });
  };

  handlePostalCode = (id: number, field: any, checked: boolean) => {
    this.setState({
      isEditPostalCode: checked,
    })
    this.onChangeField(id, field)
  }

  handlePostalCode2 = (id: number, field: any, checked: boolean) => {
    this.setState({
      isEditPostalCode2: checked,
    })
    this.onChangeField(id, field)
  }

  handlePostalCodeCancel = () => {
    this.setState({
      visiblePostalCode: false,
    });
  };

  handlePostalCodeShow = () => {
    this.setState({
      visiblePostalCode: true,
    });
  };

  handlePostalCodeCancel2 = () => {
    this.setState({
      visiblePostalCode2: false,
    });
  };

  handlePostalCodeShow2 = () => {
    this.setState({
      visiblePostalCode2: true,
    });
  };

  handleAddressSettingModalOpen = () => {
    this.setState({
      visibleAddressSetting: true
    });
  };

  handleAddressSettingModalClose = () => {
    this.setState({
      visibleAddressSetting: false
    });
  };

  render() {
    const {
      visible,
      field,
      apiName,
      isEditPostalCode,
      isEditPostalCode2,
      visiblePostalCode,
      visiblePostalCode2,
      visibleAddressSetting
    } = this.state;
    const { manualFieldList, autoFieldList, activeKey, onChangeActiveKey, onFieldChange, onSortEnd } = this.props;
    const columns = [
      {
        title: 'Sequence',
        dataIndex: 'sequence',
        key: 'c1'
      },
      {
        title: 'Field name',
        dataIndex: 'fieldName',
        key: 'c2'
      },
      {
        title: 'Field type',
        dataIndex: 'filedType',
        key: 'c3',
        render: (text, record) => (
          <>
            <div>
              {text === 0 ? 'Text' : text === 1 ? 'Number' : 'Letter & Number'}
              {' '}
              {record.fieldKey === "postCode" ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.onOpenModal(record);
                  }}
                  className="iconfont iconEdit"
                ></a>
              ) : null}
            </div>
          </>
        )
      },
      {
        title: 'Input type',
        dataIndex: 'fieldName',
        key: 'c4',
        render: (text, record) => (
          <div>
            {INPUT_TYPE.reduce((prev, curr) => {
              if (record[curr.key] === 1) {
                prev.push(curr.value);
              }
              return prev;
            }, []).join('+')}{' '}
            {text === 'City' ? (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.onOpenModal(record);
                }}
                className="iconfont iconEdit"
              ></a>
            ) : null}
          </div>
        )
      },
      {
        title: 'Validation',
        dataIndex: 'validationFlag',
        key: 'validationFlag',
        render: (text, record) => {
          let fieldName = record.fieldName || '';
          if (fieldName === 'Postal code') {
            return (
              <AuthWrapper functionName='f-postCodeBlockList-edit'>
                <div className='validation-wrap'>
                  <Switch
                    // checked={isEditPostalCode}
                    defaultChecked={text === 1}
                    onChange={(checked) => this.handlePostalCode(record.id, { validationFlag: checked ? 1 : 0 }, checked)}
                  />
                  {
                    isEditPostalCode || (text === 1)
                      ? (<a onClick={this.handlePostalCodeShow} className='iconfont iconEdit' />)
                      : null
                  }
                </div>
              </AuthWrapper>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: 'Max length',
        dataIndex: 'maxLength',
        key: 'c5'
      },
      {
        title: 'Field columns',
        dataIndex: 'occupancyNum',
        key: 'c8',
        render: (text, record) => (
          <Radio.Group buttonStyle="solid" value={text} onChange={(e) => this.onChangeField(record.id, { occupancyNum: e.target.value })}>
            <Radio.Button value={1}>1</Radio.Button>
            <Radio.Button value={2}>2</Radio.Button>
          </Radio.Group>
        )
      },
      {
        title: 'Required',
        dataIndex: 'requiredFlag',
        key: 'c6',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { requiredFlag: checked ? 1 : 0 })} />
      },
      {
        title: 'Enable',
        dataIndex: 'enableFlag',
        key: 'c7',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { enableFlag: checked ? 1 : 0 })} />
      }
    ];
    const columns2 = [
      {
        title: 'Sequence',
        dataIndex: 'sequence',
        key: 'c1'
      },
      {
        title: 'Field name',
        dataIndex: 'fieldName',
        key: 'c2'
      },
      {
        title: 'Field type',
        dataIndex: 'filedType',
        key: 'c3',
        render: (text, record) => (
          <>
            <div>
              {text === 0 ? 'Text' : text === 1 ? 'Number' : 'Letter & Number'}
              {' '}
              {record.fieldKey === "postCode" ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.onOpenModal(record);
                  }}
                  className="iconfont iconEdit"
                ></a>
              ) : null}
            </div>
          </>
        )
      },
      {
        title: 'Input type',
        dataIndex: 'fieldName',
        key: 'c4',
        render: (text, record) => (
          <div>
            {INPUT_TYPE.reduce((prev, curr) => {
              if (record[curr.key] === 1) {
                prev.push(curr.value);
              }
              return prev;
            }, []).join('+')}{' '}
            {text === 'City' ? (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.onOpenModal(record);
                }}
                className="iconfont iconEdit"
              ></a>
            ) : null}
          </div>
        )
      },
      {
        title: 'Validation',
        dataIndex: 'validationFlag',
        key: 'validationFlag',
        render: (text, record) => {
          let fieldName = record.fieldName || '';

          switch (fieldName) {
            case 'Postal code':
              return (
              <AuthWrapper functionName='f-postCodeBlockList-edit'>
                <div className='validation-wrap'>
                  <Switch
                    // checked={isEditPostalCode}
                    defaultChecked={text === 1}
                    onChange={(checked) => this.handlePostalCode2(record.id, { validationFlag: checked ? 1 : 0 }, checked)}
                  />
                  {
                    isEditPostalCode2 || (text === 1)
                      ? (<a onClick={this.handlePostalCodeShow2} className='iconfont iconEdit' />)
                      : null
                  }
                </div>
              </AuthWrapper>
            );
            case 'Address1':
              return (<a onClick={this.handleAddressSettingModalOpen} className="iconfont iconEdit"/>)
            default: return null
          }
        },
      },
      {
        title: 'Max length',
        dataIndex: 'maxLength',
        key: 'c5'
      },
      {
        title: 'Field columns',
        dataIndex: 'occupancyNum',
        key: 'c8',
        render: (text, record) => (
          <Radio.Group buttonStyle="solid" value={text} onChange={(e) => this.onChangeField(record.id, { occupancyNum: e.target.value })}>
            <Radio.Button value={1}>1</Radio.Button>
            <Radio.Button value={2}>2</Radio.Button>
          </Radio.Group>
        )
      },
      {
        title: 'Required',
        dataIndex: 'requiredFlag',
        key: 'c6',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { requiredFlag: checked ? 1 : 0 })} />
      },
      {
        title: 'Enable',
        dataIndex: 'enableFlag',
        key: 'c7',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { enableFlag: checked ? 1 : 0 })} />
      }
    ];

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

    const addressDisplaySettingId = manualFieldList.find(item => item.fieldKey === 'postCode')?.id;
    const addressDisplaySettingId2 = autoFieldList.find(item => item.fieldKey === 'postCode')?.id;

    const address1InAutoTable = autoFieldList.find(item => item.fieldKey === 'address1') ?? {};

    return (
      <div className='fields-wrap'>
        <Tabs activeKey={activeKey} onChange={onChangeActiveKey}>
          <Tabs.TabPane tab="Input manually" key="MANUALLY">
            {/* <Button type="primary" onClick={() => onStepChange(2)} style={{ marginBottom: 10 }}>
              Display
            </Button> */}
            <SortFields columns={columns} dataList={manualFieldList} onSortEnd={onSortEnd} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Input automatically" key="AUTOMATICALLY">
            {/* <Button type="primary" onClick={() => onStepChange(2)} style={{ marginBottom: 10 }}>
              Display
            </Button> */}
            <SortFields columns={columns2} dataList={autoFieldList} onSortEnd={onSortEnd} />
          </Tabs.TabPane>
        </Tabs>

        <Modal title="Edit field" visible={visible} okText="Save" cancelText="Cancel" onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form {...formItemLayout}>
            <Form.Item label="Field name">
              <Input value={field.fieldName} disabled />
            </Form.Item>
            <Form.Item label="Input type">
              {field.fieldName === 'City' && (
                <Select
                  value={field.inputSearchBoxFlag === 1 && field.inputFreeTextFlag === 1 ? '1' : field.inputSearchBoxFlag === 1 ? '3' : field.inputDropDownBoxFlag === 1 ? '2' : '0'}
                  onChange={(v) => this.onChangeModalField(v === '0' ? { inputFreeTextFlag: 1, inputSearchBoxFlag: 0, inputDropDownBoxFlag: 0 } : v === '1' ? { inputFreeTextFlag: 1, inputSearchBoxFlag: 1, inputDropDownBoxFlag: 0 } : v === '2' ? { inputFreeTextFlag: 0, inputSearchBoxFlag: 0, inputDropDownBoxFlag: 1 } : { inputFreeTextFlag: 0, inputSearchBoxFlag: 1, inputDropDownBoxFlag: 0 })}
                >
                  <Option value="0" key="0">
                    Free text
                  </Option>
                  <Option value="1" key="1">
                    Free text + Search box
                  </Option>
                  <Option value="2" key="2">
                    Drop down
                  </Option>
                  <Option value="3" key="3">
                    Search box
                  </Option>
                </Select>
              )}
              {field.fieldKey === 'postCode' && (
                <>
                  <Select
                    value={field.filedType}
                    onChange={(v: any) => {
                      this.onChangeModalField({ filedType: v })
                    }}
                  >
                    <Option value={0} key={0}>
                      text
                    </Option>
                    <Option value={1} key={1}>
                      number
                    </Option>
                    <Option value={2} key={2}>
                      Letter & Number
                    </Option>
                  </Select>
                </>
              )}
            </Form.Item>
            {field.fieldName === 'City' ? (
              <Form.Item label="Data source">
                <Input value="Address list" disabled />
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
        {
          visiblePostalCode
            ? (
              <PostalCodeModal
                addressDisplaySettingId={addressDisplaySettingId}
                visible={visiblePostalCode}
                onCancel={this.handlePostalCodeCancel}
              />
            )
            : null
        }
        {
          visiblePostalCode2
            ? (
              <PostalCodeModal
                addressDisplaySettingId={addressDisplaySettingId2}
                visible={visiblePostalCode2}
                onCancel={this.handlePostalCodeCancel2}
              />
            )
            : null
        }
        {
          visibleAddressSetting
            ? (
            <AddressSettingModal
              fieldId={address1InAutoTable.id}
              suggestionFlag={address1InAutoTable.suggestionFlag}
              validationFlag={address1InAutoTable.validationFlag}
              onChangeField={onFieldChange}
              visible={visibleAddressSetting}
              onCancel={this.handleAddressSettingModalClose} 
            />
            )
            : null
        }
      </div>
    );
  }
}
