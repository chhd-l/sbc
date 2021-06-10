import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input, Select, Button, Radio, Modal, DatePicker, Row, Col, Card } from 'antd';
import { RCi18n, Const } from 'qmkit';
import type { fieldDataType, labelDataType } from '../data.d';
import { batchExportMain } from '../webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

interface BatchExportProps {
  fieldData: fieldDataType[];
  selectData?: labelDataType[];
  form: any;
  history: any;
  title: string;
  exportType: number;
}

class BatchExport extends Component<BatchExportProps, any> {
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      fieldKey: {},
      selectKey: [],
      exportField: 'search',
      loading: false
    };
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    if (this.props.title !== prevProps.title) {
      let fieldKey = {};
      this.props.fieldData.forEach(item => {
        fieldKey[item.key] = item.key;
      });
      this.setState({
        fieldKey
      })
    }
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
            this.props.form.setFieldsValue({ [idx]: '' });
          }}
          style={styles.leftLabel}
          defaultValue={label[0].value}
        >
          {label.map(item => {
            let name = item.langKey ? RCi18n({ id: item.langKey }) : item.name;
            return (
              <Option key={item.value} title={name} value={item.value}>
                {name}
              </Option>
            )
          })}
        </Select>)
    } else {
      return <Input style={styles.leftLabel} title={label || ''} disabled defaultValue={label || ''} />
    }
  }

  getFields() {
    const { fieldKey, exportField } = this.state;
    const { fieldData, form: { getFieldDecorator, getFieldValue } } = this.props;
    // const { getFieldDecorator, getFieldValue } = this.props.form;
    const children = fieldData.map(item => {
      let content = <Input style={styles.wrapper} disabled={exportField === 'all'}/>;
      if (item.options) {
        let opts = item.options[fieldKey[item.key]] || [];
        // 判断当前选项是否根据其它值联动
        if (item.optionLink) {
          let linkVal = getFieldValue(item.optionLink) || '';
          if (linkVal === 'ContractProduct') {
            opts = opts.filter((item) => item.value === 'SmartFeeder');
          } else if (linkVal.indexOf('Club') > -1) {
            opts = opts.filter((item) => item.value === 'Cat_Dog' || item.value === 'Dog' || item.value === 'Cat');
          } else {
            opts = []
          }
        }
        content = (
          <Select
            disabled={exportField === 'all'}
            style={styles.wrapper}
            onChange={() => {
              // 如果选择的值影响其他下拉框的选项，则将那个受影响的下拉框的值清空
              if (item.valueLink) {
                this.props.form.setFieldsValue({ [item.valueLink]: '' });
              }
            }}
          >
            {
              opts.map(opt => {
                let name = opt.langKey ? RCi18n({ id: opt.langKey }) : opt.name;
                return (
                  <Option value={opt.value} title={name} key={opt.value}>
                    {name}
                  </Option>
                )
              })
            }
          </Select>
        )
      }

      const component = item.type === 'rangePicker' ? (
        <Col span={8} id="Range-picker-width" key={item.key}>
          <FormItem>
            {getFieldDecorator(item.key, {
              rules: [
                {
                  required: false,
                  message: '',
                },
              ],
            })(<RangePicker
              disabledDate={current => current && current > moment().endOf('day')}
              disabled={exportField === 'all'}
              className="rang-picker-width"
              style={styles.formItemStyle}
            />)}
          </FormItem>
        </Col>
      ) : (
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
        </Col>)
      return component;
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {selectData.map(item => {
          return (
            <span key={item.value} onClick={() => this.btnSelect(item.value)} className={['select_style', selectKey.indexOf(item.value) > -1 ? 'active' : ''].join(' ')}>
              {item.name}
            </span>
          )
        })}
      </div>
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
    this.setState({
      loading: true
    });
    let { fieldKey, selectKey, exportField } = this.state;
    let { exportType, form } = this.props;
    let params = {
      "module": exportType,
      "pickColums": selectKey,
      "tradeExportRequest": {}
    };
    if (exportField === 'search') {
      form.validateFields((err, values) => {
        if (!err) {
          let obj = {};
          // 单独处理时间值
          let timeArr = values.beginTime;
          if (timeArr && timeArr.length) {
            obj['beginTime'] = timeArr[0].format(Const.DAY_FORMAT);
            obj['endTime'] = timeArr[1].format(Const.DAY_FORMAT);
          }
          delete fieldKey['beginTime'];

          // 单独处理 Frequency
          let cycleTypeId = values.cycleTypeId_autoship;
          if (cycleTypeId) {
            obj['cycleTypeId'] = cycleTypeId;
          }
          delete fieldKey['cycleTypeId_autoship'];

          for (let key in fieldKey) {
            if (key === 'orderType') {// orderType要默认赋值
              obj[fieldKey[key]] = values[key] || 'ALL_ORDER';
            } else {
              obj[fieldKey[key]] = values[key] || '';
            }
          }

          params.tradeExportRequest = obj;
        }
      });
    }

    batchExportMain(params).then(({res}) => {
      this.setState({
        loading: false
      });
      if(res.code === 'K-000000') {
        Modal.success({
          width: 550,
          centered: true,
          content: RCi18n({ id: 'Public.exportConfirmTip' }),
          okText: RCi18n({ id: 'Order.btnConfirm' }),
          icon: '',
          onOk: () => {
            this.props.history.goBack();
          },
          okButtonProps: {
            style: {
              marginRight: 200
            }
          }
        });
      }
    });
  }

  render() {
    const { selectData, title } = this.props;
    return (
      <Card title={<span style={{ color: '#ff1f4e' }}>{RCi18n({ id: 'Public.exportTip' })}</span>} bordered={false}>
        <div style={contentStyle}>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{RCi18n({ id: 'Public.Export' })}</div>
          <Radio.Group defaultValue="search" onChange={e => this.setState({ exportField: e.target.value })}>
            <Radio style={radioStyle} value="all">
              {RCi18n({ id: 'Order.all' })} {title} ({RCi18n({ id: 'Public.maximumTip' })})
            </Radio>
            <Radio style={radioStyle} value="search">
              {RCi18n({ id: 'Product.Search' })} {title}
            </Radio>
          </Radio.Group>
          <div style={fieldStyle}>{this.getFields()}</div>
        </div>
        {!!selectData?.length && (
          <div style={contentStyle}>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{RCi18n({ id: 'Public.Objects' })}</div>
            <Radio style={radioStyle} defaultChecked>
              {RCi18n({ id: 'Menu.Order' })}
            </Radio>
            <div style={fieldStyle}>{this.getSelects()}</div>
          </div>
        )}
        <div>
          <Button onClick={() => this.props.history.goBack()} style={{ marginRight: 30 }}>{RCi18n({ id: 'Public.Cancel' })}</Button>
          <Button type="primary" onClick={() => this.onExport()} loading={this.state.loading}>{RCi18n({ id: 'Public.Export' })}</Button>
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
    width: 370
  },
  leftLabel: {
    width: 170,
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