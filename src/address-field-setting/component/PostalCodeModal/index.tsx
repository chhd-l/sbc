import React from 'react';
import {
    Select,
    Input,
    Modal,
    Table,
    Form,
    Popconfirm,
    Icon,
    Divider,
    Alert,
  Button,
} from 'antd';
import {Const, RCi18n} from 'qmkit';
import './index.less';

const styles = {
    label: {
        width: 151,
        textAlign: 'center'
    },
    wrapper: {
        width: 177
    }
} as any;

const { Option } = Select;
const alertText = 'If you add this filter to the blackList postal code, several subscription or orders will not be delivered to your customers. Are you sure you want to add it?               '

// @ts-ignore
@Form.create()
export default class PostalCodeModal extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            dataSource: [],
            editList: [], // 已存在待编辑List
            ruleNo: 0,
            count: 1,
            loading: false,
            popconfirmVisible: false,
            condition: true, // Whether meet the condition, if not show popconfirm.
        }
    }

    componentDidMount() {
        // init数据
        this.initList();
    }

    // 初始化数据
    initList = async () => {

        this.setState({ loading: true});
        await setTimeout(() => {
            this.setState({
                editList: [],
                dataSource: [
                    {
                        id: 0,
                        operator: '',
                        postalCode: '',
                    }
                ]

            })
        }, 1500)
        this.setState({ loading: false});
    }

    handleOk = (values) => {
        console.log('handleOk', values);
        this.cancel();
        this.handleCancel();
    };

    handleCancel = () => {
        let {onCancel} = this.props;
        onCancel();
    };

    handleAdd = () => {
        const {
            count,
            dataSource,
        } = this.state;
        const newData = {
            id: count,
            operator: '',
            postalCode: null,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.id !== key) });
    };
    getColumns = () => {
        const { getFieldDecorator } = this.props.form;

        return [
            {
                title: <strong>{`${RCi18n({id: 'Setting.Operator'})}`}</strong>,
                dataIndex: 'operator',
                width: '35%',
                render: (rowInfo, record, index) => {
                    return (
                      <div>
                          <Form.Item key={record.id}>
                              {
                                  getFieldDecorator(`mappings[${index}].operator`, {
                                      rules: [
                                          {
                                              required: true,
                                              message: 'Please input operator!'
                                          },
                                      ],
                                      initialValue: record.operator || ''
                                  })(
                                    <Select style={{width: '120px'}}>
                                        <Option value="equal">=</Option>
                                        <Option value="beginWith">begin with</Option>
                                    </Select>
                                  )
                              }

                          </Form.Item>
                          <Form.Item>
                              {
                                  getFieldDecorator(`mappings[${index}].id`, {
                                      initialValue: record.id
                                  })(
                                    <Input hidden />
                                  )
                              }
                          </Form.Item>

                      </div>
                    );
                }
            },
            {
                title: <strong>{`${RCi18n({id: 'Setting.Value'})}`}</strong>,
                dataIndex: 'postalCode',
                width: '35%',
                render: (rowInfo, record, index) => {
                    return (
                      <Form.Item key={record.id}>
                          {
                              getFieldDecorator(`mappings[${index}].postalCode`, {
                                  rules: [
                                      {
                                          required: true,
                                          message: 'Please input postalCode!'
                                      },
                                  ],
                              })(
                                <Input placeholder='Postal Code' />
                              )
                          }
                      </Form.Item>
                    );
                }
            },
            {
                title: <strong>{`${RCi18n({id: 'Subscription.Operation'})}`}</strong>,
                dataIndex: 'Operation',
                width: '30%',
                render: (text, record, index) => {
                    return <span>
                        <Icon
                          style={{ paddingRight: 8, fontSize: '16px', color: 'red', cursor: 'pointer' }}
                          type="plus-circle"
                          onClick={(e) => this.handleAdd()}
                        />
                        <Divider type="vertical" style={{paddingBottom: 10}} />
                        {
                            index > 0
                              ? (
                                <Popconfirm
                                  title={RCi18n({id: 'Subscription.SureToDelete'})}
                                  onConfirm={() => this.handleDelete(record.id)}
                                >
                                    <a style={{paddingLeft: 5}} className="iconfont iconDelete"/>
                                </Popconfirm>
                              )
                              : null
                        }
                    </span>;
                },
            }
        ]
    };

    confirm = () => {
        this.props.form.validateFieldsAndScroll( async (err, values) => {

            if (!err) {
                this.handleOk(values);
            }else {
                return;
            }
        });

    };

    showPopconfirm = () => {
        this.setState({ popconfirmVisible: true });
    }
    cancel = () => {
        this.setState({ popconfirmVisible: false });
    };

    changeCondition = value => {
        this.setState({ condition: value });
    };

    handleVisibleChange = visible => {
        console.log('visible', visible)
        if (!visible) {
            this.setState({ visible });
            return;
        }

        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                console.log('values', values);

                // 1 提交之前要 PostalCode 校验
                this.setState({confirmLoading: true});
                setTimeout(() => {

                    this.setState({
                        condition: !this.state.condition,
                        confirmLoading: false,
                    }, () => {
                        // 1.1 校验成功直接提交
                        if (this.state.condition) {
                            this.handleOk(values); // next step
                        } else {  // 1.2 校验失败显示确认框
                            this.showPopconfirm();
                        }
                    })
                }, 2000)

            }else {
                return;
            }
        });

    };

    render() {
        let {
            visible,
        } = this.props;
        const { getFieldDecorator } = this.props.form;

        let {
            loading,
            dataSource,
            confirmLoading,
            popconfirmVisible,
        } = this.state;

        let columns = this.getColumns();

        return (
            <Modal
                width={800}
                wrapClassName='PostalCodeModal-wrap'
                title={<strong><span>Validation Rule Setting</span></strong>}
                visible={visible}
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        Cancel
                    </Button>,
                    <Popconfirm
                      overlayClassName='PostalCodeModal-popconfirm'
                      title={<div style={{width: '250px'}}>"If you add this filter to the blacklist postal code, several subscription or orders will not be delivered to your customers. Are you sure you want to add it ?"</div>}
                      visible={this.state.popconfirmVisible}
                      onVisibleChange={this.handleVisibleChange}
                      onConfirm={this.confirm}
                      onCancel={this.cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                        <Button key="submit" type="primary" loading={confirmLoading}>
                            OK
                        </Button>
                    </Popconfirm>,
                ]}
            >
                <div className='PostalCodeModal-main'>
                    <div className='PostalCodeModal-title'>
                        Postal code met following filters will blocked
                    </div>
                    <div className='PostalCodeModal-table-wrap'>
                        <div className='PostalCodeModal-table-main'>
                            <Table
                                loading={loading}
                                dataSource={dataSource}
                                columns={columns}
                                pagination={false}
                                size="small"
                                rowKey='id'
                            />
                        </div>
                        <div className='msg-title'>Alert Message when validation fails:</div>
                        <div className='msg-input'>
                            {
                                getFieldDecorator(`mappings.msg`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input postalCode!'
                                        },
                                    ],
                                    initialValue: 'Sorry we are not able to deliver your order in this area.',
                                })(
                                  <Input style={{width: '80%'}} placeholder='' />
                                )
                            }
                        </div>
                        <p>
                            {
                                popconfirmVisible && (<Alert message={alertText} type='error'/>)
                            }
                        </p>
                    </div>
                </div>
            </Modal>
        );
    }
}