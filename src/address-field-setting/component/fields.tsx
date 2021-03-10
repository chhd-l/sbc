import React from 'react';
import { Headline, Const } from 'qmkit';
import { Alert, Table, Button, Switch, Modal, Form, Input, Select } from 'antd';
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

  render() {
    const { visible, field, apiName } = this.state;
    const { fieldList } = this.props;
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
            {text === 'Address1' || text === 'City' ? (
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
        title: 'Required',
        dataIndex: 'requiredFlag',
        key: 'c6',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { requiredFlag: checked })} />
      },
      {
        title: 'Enable',
        dataIndex: 'enableFlag',
        key: 'c7',
        render: (text, record) => <Switch checked={text === 1} onChange={(checked) => this.onChangeField(record.id, { enableFlag: checked })} />
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
        <Table rowKey="id" columns={columns} dataSource={fieldList} pagination={false} />
        <Modal title="Edit field" visible={visible} okText="Save" cancelText="Cancel" onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form {...formItemLayout}>
            <Form.Item label="Field name">
              <Input value={field.fieldName} disabled />
            </Form.Item>
            <Form.Item label="Input type">
              {field.fieldName === 'Address1' && (
                <Select value={field.inputFreeTextFlag === 1 ? '1' : '2'} onChange={(v) => this.onChangeModalField(v === '1' ? { inputFreeTextFlag: 1, inputSearchBoxFlag: 0 } : { inputFreeTextFlag: 0, inputSearchBoxFlag: 1 })}>
                  <Option value="1" key="1">
                    Free text
                  </Option>
                  <Option value="2" key="2">
                    Search box
                  </Option>
                </Select>
              )}
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
            {field.fieldName === 'City' || field.inputSearchBoxFlag === 1 ? (
              <Form.Item label="Data source">
                <Input value={field.fieldName === 'City' ? 'Address list' : 'API'} disabled />
              </Form.Item>
            ) : null}
            {field.fieldName === 'Address1' && field.inputSearchBoxFlag === 1 ? (
              <Form.Item label="API name">
                <Input value={apiName} disabled />
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </div>
    );
  }
}
