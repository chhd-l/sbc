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
  message,
} from 'antd';
import { cache, Const, RCi18n } from 'qmkit';
const { TextArea } = Input;
import {
    getPostCodeBlockList,
    validPostCodeBlock,
    editPostCodeBlockList,
} from '../../webapi';
import './index.less';

const { Option } = Select;

// @ts-ignore
@Form.create()
export default class PostalCodeModal extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            dataSource: [],
            editData: {}, // 已存在黑名单对象
            postalCodeAlert : '',
            count: 1,
            loading: false,
            popconfirmVisible: false,
            condition: false,
        }
    }

    componentDidMount() {
        const {
            addressDisplaySettingId
        } = this.props;
        // init数据
        this.initList(addressDisplaySettingId);
    }

    // 初始化数据
    initList = async (addressDisplaySettingId) => {
        if (!addressDisplaySettingId) return;
        this.setState({ loading: true});
        let { res } = await getPostCodeBlockList(addressDisplaySettingId);
        this.setState({ loading: false});

        if(res.code === Const.SUCCESS_CODE){
            this.setState({
                editData: res.context ?? {},
                dataSource: res.context?.addressDisplayValidJsonVO?.list ?? [
                    {
                        id: 0,
                        operator: '',
                        postalCode: '',
                    }
                ], // 接口数据为空，默认添加一条数据
                postalCodeAlert: res.context?.addressDisplayValidJsonVO?.alert ?? RCi18n({id: 'Setting.postalCodeAlert'}),
            })
        }
    }

    handleOk = async (values) => {
        console.log('handleOk', values);
        const {
            addressDisplaySettingId
        } = this.props;
        let {
            editData,
        } = this.state;
        let context = JSON.stringify({
            list: values.mappings,
            alert: values.alert,
        })
        let params = {
            addressDisplaySettingId,
            context,
            id: editData?.id || undefined
        }
        this.cancel();
        this.setState({confirmLoading: true});

        let {res} = await editPostCodeBlockList(params);
        this.setState({confirmLoading: false});

        if(res.code === Const.SUCCESS_CODE){
            message.success(RCi18n({id:'Product.OperateSuccessfully'}));
            this.handleCancel();
        }else{

        }

    };

    confirm = () => {
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            console.log('confirm err', err);
            console.log('confirm values', values);
            if (!err){
                this.handleOk(values);
            }
        });
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

    handleDelete = index => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
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
                          <Form.Item>
                              {
                                  getFieldDecorator(`mappings[${index}].rule`, {
                                      rules: [
                                          {
                                              required: true,
                                              message: 'Please input operator!'
                                          },
                                      ],
                                      initialValue: record.rule  || ''
                                  })(
                                    <Select style={{width: '120px'}}>
                                        <Option value={1}>=</Option>
                                        <Option value={2}>begin with</Option>
                                    </Select>
                                  )
                              }

                          </Form.Item>
                          {/*<Form.Item>*/}
                          {/*    {*/}
                          {/*        getFieldDecorator(`mappings[${index}].id`, {*/}
                          {/*            initialValue: index*/}
                          {/*        })(*/}
                          {/*          <Input hidden />*/}
                          {/*        )*/}
                          {/*    }*/}
                          {/*</Form.Item>*/}
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
                      <Form.Item>
                          {
                              getFieldDecorator(`mappings[${index}].value`, {
                                  rules: [
                                      {
                                          required: true,
                                          message: 'Please input postalCode!'
                                      },
                                      {
                                          pattern: /^[0-9A-Za-z]+$/,
                                          message: RCi18n({id:"PetOwner.theCorrectPostCode"})
                                      },
                                  ],
                                  initialValue: record.value  || ''
                              })(
                                <Input  placeholder='Postal Code' />
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
                                  onConfirm={() => this.handleDelete(index)}
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
        if (!visible) {
            this.setState({ visible });
            return;
        }
        const { setFields } = this.props.form;

        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                console.log('values', values);
                this.setState({confirmLoading: true});

                // 1 提交之前校验添加的邮编黑名单，是否对已有订单产生影响
                let { res } = await validPostCodeBlock({
                    list: values.mappings,
                })
                this.setState({confirmLoading: false})
                if(res.code === Const.SUCCESS_CODE){
                    const isVerify = !!(res.context?.validFlag);
                    // 1就是成功 0就是失败
                    if (isVerify){
                        this.handleOk(values); // next step
                    }else {
                        // 1.2 校验失败显示确认框
                        const orderPostalCodeBlacklist = res.context?.list ?? [];
                        const orderPostalCodeAlertArr = values.mappings.filter(item => orderPostalCodeBlacklist.includes(item.value));
                        if (orderPostalCodeAlertArr.length > 0){
                            // 高亮影响order的postalCode
                            orderPostalCodeAlertArr.forEach((item, index) => {
                                setFields({
                                    [`mappings[${index}].value`]: {
                                        value: values.mappings[index].value,
                                        errors: [new Error('')],
                                    }
                                })
                            })
                        }
                        // this.setState({
                        //     condition: !isVerify
                        // })
                        this.showPopconfirm();
                    }
                    // this.setState({
                    //     condition: !!(res.context?.validFlag),
                    // }, () => {
                    //     // 1.1 校验成功直接提交
                    //     if (this.state.condition) {
                    //         this.handleOk(values); // next step
                    //     }
                    //     else {
                    //         // 1.2 校验失败显示确认框
                    //         const orderPostalCodeBlacklist = res.context?.list ?? [];
                    //         const orderPostalCodeAlertArr = values.mappings.filter(item => orderPostalCodeBlacklist.includes(item.value));
                    //         if (orderPostalCodeAlertArr.length > 0){
                    //             // 高亮影响order的postalCode
                    //             orderPostalCodeAlertArr.forEach((item, index) => {
                    //                 setFields({
                    //                     [`mappings[${index}].value`]: {
                    //                         value: values.mappings[index].value,
                    //                         errors: [new Error('')],
                    //                     }
                    //                 })
                    //             })
                    //         }
                    //
                    //         this.showPopconfirm();
                    //     }
                    // })
                }else {

                }
            }else {
                return;
            }
        });

    };

    getAlertText = () => {
        // 当前国家
        const currentCountry = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0];

        const defaultAlertText = 'If you add this postal code to the blacklist postal code, several subscription or orders will not be delivered to your customers. Are you sure you want to add it ?';
        const alertCountryText = {
            en: defaultAlertText,
            ru: 'Si vous ajoutez ce code postal à la liste noire, plusieurs souscriptions ou commandes ne pourront pas être livré à vos clients. Etes vous sûr de vouloir continuer ?'
        }
        switch (currentCountry) {
            case 'en':
                return alertCountryText.en;
            case 'ru':
                return alertCountryText.ru;
            default:
                return defaultAlertText;
        }
    }

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
            condition,
            postalCodeAlert,
        } = this.state;

        let columns = this.getColumns();

        return (
            <Modal
                width={800}
                wrapClassName='PostalCodeModal-wrap'
                title={<strong><span>Validation Rule Setting</span></strong>}
                visible={visible}
                // onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        Cancel
                    </Button>,
                    <Popconfirm
                      overlayClassName='PostalCodeModal-popconfirm'
                      title={
                          <div style={{width: '250px'}}>{this.getAlertText()}</div>
                      }
                      visible={popconfirmVisible}
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
                                getFieldDecorator('alert', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input Alert Message!'
                                        },
                                    ],
                                    initialValue: postalCodeAlert || '',
                                })(
                                  <TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
                                )
                            }
                        </div>
                        {/*<p>*/}
                        {/*    {*/}
                        {/*        popconfirmVisible && (<Alert closable message={this.getAlertText()} type='error'/>)*/}
                        {/*    }*/}
                        {/*</p>*/}
                    </div>
                </div>
            </Modal>
        );
    }
}