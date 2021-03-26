import React from 'react';
import { Headline, Const } from 'qmkit';
import { Radio, Button, Switch, Modal, Form, Input, Select, Tabs } from 'antd';
import SortFields from './sort-fields';
import { getAddressSetting } from '../../validation-setting/webapi';

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
      apiName: ''
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
    this.setState({
      manu
    });
  };

  render() {
    const { visible, field, apiName } = this.state;
    const { manualFieldList, autoFieldList, activeKey, onChangeActiveKey, onStepChange, onSortEnd } = this.props;
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
        render: (text, record) => <div>{text === 0 ? 'Text' : 'Number'}</div>
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
    return (
      <div>
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
            <SortFields columns={columns} dataList={autoFieldList} onSortEnd={onSortEnd} />
          </Tabs.TabPane>
        </Tabs>

        <Modal title="Edit field" visible={visible} okText="Save" cancelText="Cancel" onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form {...formItemLayout}>
            <Form.Item label="Field name">
              <Input value={field.fieldName} disabled />
            </Form.Item>
            <Form.Item label="Input type">
              {field.fieldName === 'City' && (
                <Select value={field.inputDropDownBoxFlag === 1 ? '2' : '1'} onChange={(v) => this.onChangeModalField(v === '1' ? { inputFreeTextFlag: 1, inputSearchBoxFlag: 1, inputDropDownBoxFlag: 0 } : { inputFreeTextFlag: 0, inputSearchBoxFlag: 0, inputDropDownBoxFlag: 1 })}>
                  <Option value="1" key="1">
                    Free text + Search box
                  </Option>
                  <Option value="2" key="2">
                    Drop down
                  </Option>
                </Select>
              )}
            </Form.Item>
            {field.fieldName === 'City' ? (
              <Form.Item label="Data source">
                <Input value="Address list" disabled />
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </div>
    );
  }
}
