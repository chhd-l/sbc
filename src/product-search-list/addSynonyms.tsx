import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Icon, message, Spin } from 'antd';
import { BreadCrumb, Headline, history, RCi18n } from 'qmkit';
import * as webapi from './webapi';

const FormItem = Form.Item;

let id = 0;

class AddSynonyms extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: RCi18n({ id: 'Product.AddSynonyms' }),
      loading: false,
      btnLoading: false
    };
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.id) {
      this.getDetail(this.props.location.state.id);
      this.setState({
        title: RCi18n({ id: 'Product.EditSynonyms' })
      });
    } else {
      this.add();
    }
  }

  async getDetail(id) {
    this.setState({
      loading: true
    });
    const { form } = this.props;
    let result = await webapi.synonFindById({ id });
    let nextKeys = [];
    result.res.context.synonyms.forEach((item, index) => {
      this.add(item);
    });
    form.setFieldsValue({
      phrase: result.res.context.phrase
    });
    this.setState({
      loading: false
    });
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key.id !== k)
    });
  };

  add = (value = '') => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({ id: id++, value });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };
  // 验证重复元素，有重复返回true；否则返回false
  isRepeat = (arr) => {
    let hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
      hash[arr[i]] = true;
    }
    return false;
  };
  handleSubmit = e => {
    this.setState({
      btnLoading: true,
      loading:true,
    });
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // Synonyms有重复 提示给用户重复
        if (this.isRepeat(values.synonyms.filter(n => n))) {
          message.warn(RCi18n({ id: 'Product.SynonymsAreRepeated' }));
          return;
        }
        let result;
        let synonyms = Array.from(new Set(values.synonyms)).filter(n => n);//再次确保没有重复的synonyms
        if (this.props.location.state && this.props.location.state.id) {
          result = await webapi.eidtSynon({
            phrase: values.phrase,
            synonyms,
            id: this.props.location.state.id
          });
        } else {
          result = await webapi.addSynon({
            phrase: values.phrase,
            synonyms
          });
        }
        if (result.res.code === 'K-000000') {
          message.success(RCi18n({ id: 'Product.OperateSuccessfully' }));
          //跳转回list页面时tab默认展开第3个
          sessionStorage.setItem('productSearchActive', '3');
          //重置一下key的值
          id = 0;

          history.go(-1);
        } else {
          message.warn(result.res.internalMessage || result.res.message);
        }
      }
    });
    setTimeout(() => {
      this.setState({
        btnLoading: false,
        loading:false,
      });
    }, 500);
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    //添加formItem 留出label的间距
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 }
      }
    };

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { title, loading, btnLoading } = this.state;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? <FormattedMessage id='Product.Synonyms(asf)' /> : ''}
        required={true}
        key={k.id}
      >
        {getFieldDecorator(`synonyms[${k.id}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: k.value,
          rules: [
            {
              required: true,
              message: RCi18n({ id: 'Product.PleaseInputSynonyms' })
            }
          ]
        })(<Input style={{ width: '80%', marginRight: 8 }} />)}
        <span>
            {
              keys.length > 1 ? (
                <Icon
                  className='dynamic-delete-button'
                  type='minus-circle-o'
                  onClick={() => this.remove(k.id)}
                />
              ) : null
            }
          <Icon type='plus-circle' onClick={() => this.add()} style={{ marginLeft: 8 }} />
        </span>
      </Form.Item>
    ));
    return (
      <Spin spinning={loading} indicator={<img className='spinner'
                                               src='https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif'
                                               style={{ width: '90px', height: '90px' }} alt='' />}>
        <BreadCrumb />
        <div className='container'>
          <Headline title={title} />
          <div style={{ width: 800 }}>
            <Form {...formItemLayout}>
              <FormItem label={<FormattedMessage id='Product.SearchPhrase' />}>
                {getFieldDecorator('phrase', {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({ id: 'Product.PleaseInputPhrase' })
                    }
                  ]
                })(
                  <Input style={{ width: '80%', marginRight: 8 }} />
                )}
              </FormItem>
              {formItems}
            </Form>
          </div>
        </div>
        <div className='bar-button'>
          <Button type='primary' onClick={this.handleSubmit} style={{ marginRight: 10 }} loading={btnLoading}>
            <FormattedMessage id='Product.Save' />
          </Button>
          <Button style={{ marginRight: 10 }} onClick={() => {
            history.go(-1);
            //跳转回list页面时tab默认展开第3个
            sessionStorage.setItem('productSearchActive', '3');
            id = 0;
          }}>
            <FormattedMessage id='Product.Cancel' />
          </Button>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(AddSynonyms);