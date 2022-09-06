import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, message, Modal, Select, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';
import { redirectionUrlAdd, redirectionUrlUpdByUrl } from '../webapi';

const { Option } = Select;

function AddNewRedirectionModal(props: any) {

  const { RedirectionData, visable, onCancel, init }: any = props;
  const { getFieldDecorator } = props.form;
  const [errmsg, setErrmsg] = useState('');

  useEffect(() => {
    // RedirectionData 可以通过这个字段判断是否是添加还是修改
    if (RedirectionData) {
      // setTimeout(() => {
      props.form.setFieldsValue(RedirectionData);
      console.log('RedirectionData', RedirectionData)
      // })

    }

  }, [RedirectionData])

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  const check = () => {
    props.form.validateFields(err => {
      // 校验没问题的话就提交修改或者添加请求
      if (!err) {
        console.info('success');
        console.log('form', props.form.getFieldsValue())
        let params = props.form.getFieldsValue();
        // params 中的status还要做下转换
        params = {
          ...params,
          status: params.status ? 1 : 0
        }
        if (RedirectionData) {
          // 修改
          console.log(' 修改', '修改');
          redirectionUrlUpdByUrl(params).then((data) => {
            console.log('redirectionUrlUpdByUrl', data.res);
            if (data.res.code === 'K-000000') {
              props.form.resetFields();
              message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }))
            } else {
              message.success(RCi18n({ id: 'PetOwner.Unsuccessful' }))
            }
          }).catch((err) => {

          }).finally(() => {
            onCancel();
            init();
          })
        } else {
          // 新增
          console.log('新增', '新增');
          redirectionUrlAdd(params).then((data) => {
            console.log('redirectionUrlAdd', data.res);
            if (data.res.code === 'K-090006') {
              setErrmsg(data.res.message);
              props.form.validateFields(['url'], { force: true });
              setTimeout(() => {
                setErrmsg('');
              }, 1000)
            } else if (data.res.code === 'K-000000') {
              message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }));
              props.form.resetFields();
              onCancel();
              init();
            }
          }).catch((err) => {
            onCancel();
            init();
          })
        }


      }
    });
  };

  const urlvalidator = (rule, value, callback) => {
    try {
      console.log('requiredUrl validator: ', { rule, value })
      if (value) {
        // RedirectionData 判断RedirectionData字段中的url是否跟表单的一致，不一致则是新增，一致则是修改
        if (RedirectionData && RedirectionData?.url === props.form.getFieldValue('url')) {
          // 相等则是修改
          // console.log('相等则是修改', '相等则是修改')
          callback();
        } else {
          if (errmsg) {
            callback(errmsg);
          } else {
            callback();
          }

          // 不相等则是新增
          // throw new Error('You need to agree to our terms to sign up.')
        }

      } else {
        throw new Error(RCi18n({ id: 'Content.requiredUrl' }))
      }
    } catch (err) {
      callback(err);
    }
  }

  return (
    <Modal
      maskClosable={false}
      title={RedirectionData ? RCi18n({ id: 'Content.EditRedirection' }) : RCi18n({ id: 'Content.AddNewRedirection' })}
      visible={visable}
      okText={RCi18n({ id: 'Content.Confirm' })}
      cancelText={RCi18n({ id: 'Content.Cancel' })}
      width={600}
      onOk={check}
      onCancel={onCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label={<FormattedMessage id='Content.URL' />}>
          {getFieldDecorator('url', {
            rules: [
              // {
              //   required: true,
              //   message: RCi18n({ id: 'Content.requiredUrl' }),
              // },
              {
                required: true,
                validator: (rule, value, callback) => urlvalidator(rule, value, callback)
              }
            ],
          })(<Input data-testid="url" disabled={RedirectionData ? true : false} />)}
          {/* {errmsg && (<span>{errmsg}</span>)} */}
        </Form.Item>
        <Form.Item label={<FormattedMessage id='Content.encodeUrl' />}>
          {getFieldDecorator('encodeUrl', {
            rules: [
              {
                required: true,
                message: RCi18n({ id: 'Content.requiredUrl' }),
              },
            ],
          })(<Input data-testid="encodeUrl" disabled={RedirectionData ? true : false} />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id='Content.Redirection' />}>
          {getFieldDecorator('redirectionUrl', {
            rules: [
              {
                required: true,
                message: RCi18n({ id: 'Content.requiredRedirection' }),
              },

            ],
          })(<Input data-testid="redirectionUrl" />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id='Content.Status' />}>
          {getFieldDecorator('status', {
            valuePropName: 'checked',
            initialValue: true,
            rules: [],
          })(<Switch />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id='Content.RedirectionType' />}>
          {getFieldDecorator('code', {
            initialValue: 302,
            rules: [],
          })(<Select>
            <Option value={302}> <FormattedMessage id='Content.Temporary' /></Option>
            <Option value={301}><FormattedMessage id='Content.Permanent' /></Option>
          </Select>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}


export default Form.create<any>({ name: 'AddNewRedirectionForm' })(AddNewRedirectionModal);