import React, { Component } from 'react';
import { Form, Input, Select, Button, Radio, Dropdown, Icon, DatePicker, Row, Col, Breadcrumb, message, Card } from 'antd';
import { RCi18n } from 'qmkit';
import type { fieldDataType, labelDataType } from '../data.d';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;

interface BatchExportProps {
  fieldData: fieldDataType[];
  selectData?: labelDataType[];
  form: any;
}

class BatchExport extends Component<BatchExportProps, any> {

  state = {
    fieldKey: {},
    selectKey: [],
  };

  componentDidMount() {
    let { fieldData } = this.props;
    let { fieldKey } = this.state;
    fieldData.forEach(item => {
      fieldKey[item.key] = item.key;
    })
    this.setState({ fieldKey });
  }

  getLabel(label, idx) {
    if (label instanceof Array) {
      return (
        <Select
          onChange={(value) => {
            let { fieldKey } = this.state;
            fieldKey[idx] = value;
            this.setState({
              fieldKey
            });
            this.props.form.setFieldsValue({[idx]: ''});
          }}
          style={styles.leftLabel}
          defaultValue={label[0].value}
        >
          {label.map(item => {
            return (
              <Option key={item.value} title={item.name} value={item.value}>
                {item.name}
              </Option>
            )
          })}
        </Select>)
    } else {
      return label || ''
    }
  }

  getFields() {
    let { fieldKey } = this.state;
    const { fieldData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const children = fieldData.map(item => {
      let content = <Input style={styles.wrapper} />;
      if(item.options) {
        let opts = item.options[fieldKey[item.key]] || [];
        content = (
          <Select style={styles.wrapper}>
            {
              opts.map(opt => {
                return (
                  <Option value={opt.value} title={opt.name} key={opt.value}>
                    {opt.name}
                  </Option>
                )
              })
            }
          </Select>
        )      
      }
      return (
        <Col span={8} key={item.key} >
          <Form.Item>
            <Input.Group compact style={styles.formItemStyle}>
              {this.getLabel(item.label, item.key)}
              {getFieldDecorator(item.key, {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(content)}
            </Input.Group>
          </Form.Item>
        </Col>
      )
    });
    return (
      <Form className="batch_export_form">
        <Row gutter={96}>{children}</Row>
      </Form>
    );
  }

  getSelects() {
    const { selectData } = this.props;
    const { selectKey } = this.state;
    return (
      <Row gutter={[16, 16]}>
        {selectData.map(item => {
          return (
            <Col span={3} key={item.value}>
              <span onClick={() => this.btnSelect(item.value)} className={['select_style', selectKey.indexOf(item.value) > -1 ? 'active' : ''].join(' ')}>
                {item.name}
              </span>
            </Col>
          )
        })}
      </Row>
    )
  }

  btnSelect(key) {
    const { selectKey } = this.state;
    let idx = selectKey.indexOf(key);
    if (idx > -1) {
      selectKey.splice(idx, 1);
    } else {
      selectKey.push(key);
    }
    this.setState({ selectKey })
  }

  onExport() {
    let { fieldKey, selectKey } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let obj = {};
        for (let key in fieldKey) {
          obj[fieldKey[key]] = values[key] || '';
        }
        console.log(obj);
      }
    });
  }

  render() {
    const { selectData } = this.props;
    return (
      <Card title={<span style={{ color: '#ff1f4e' }}>{RCi18n({ id: 'Public.exportTip' })}</span>} bordered={false}>
        <div style={contentStyle}>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>Export</div>
          <Radio.Group defaultValue={2}>
            <Radio style={radioStyle} value={1}>
              All orders (The maximum period is six months)
            </Radio>
            <Radio style={radioStyle} value={2}>
              Search orders
            </Radio>
          </Radio.Group>
          <div style={fieldStyle}>{this.getFields()}</div>
        </div>
        {selectData?.length && (
          <div style={contentStyle}>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>Objects</div>
            <Radio style={radioStyle} defaultChecked>Order</Radio>
            <div style={fieldStyle}>{this.getSelects()}</div>
          </div>
        )}
        <div>
          <Button onClick={() => this.onExport()} style={{ marginRight: 30 }}>Cancel</Button>
          <Button type="primary" onClick={() => this.onExport()}>Export</Button>
        </div>

      </Card>
    )
  }
}

export default Form.create({ name: 'batch_export' })(BatchExport);

const fieldStyle = {
  // width: '80%',
  padding: 40,
  paddingTop: 10
}

const radioStyle = {
  display: 'block',
  height: '40px',
  lineHeight: '40px',
};

const contentStyle = {
  borderBottom: '1px solid #eee',
  marginBottom: 10
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  wrapper: {
    width: 200
  }
};