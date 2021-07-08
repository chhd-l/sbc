import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Icon, message } from 'antd';
import { BreadCrumb, Headline, history, RCi18n } from 'qmkit';
import * as webapi from './webapi';

const FormItem = Form.Item;

let id = 0;
class AddSynonyms extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: RCi18n({id:'Product.AddSynonyms'}),
    };
  }
  componentDidMount() {
    if(this.props.location.state && this.props.location.state.id){
      this.getDetail(this.props.location.state.id)
    }else {
      this.add()
    }
  }
  async getDetail(id){
    const { form } = this.props;
    let result = await webapi.synonFindById({id})
    let nextKeys = []
    result.res.context.synonyms.forEach((item,index)=>{
      this.add(item)
    })
    form.setFieldsValue({
      phrase: result.res.context.phrase,
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
      keys: keys.filter(key => key.id !== k),
    });
  };

  add = (value = '') => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({id:id++,value});
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result;
        let synonyms = Array.from(new Set(values.synonyms)).filter(n => n)
        if(this.props.location.state && this.props.location.state.id){
          result = await webapi.eidtSynon({
            phrase: values.phrase,
            synonyms,
            id:this.props.location.state.id
          })
        }else {
          result = await webapi.addSynon({
            phrase: values.phrase,
            synonyms,
          })
        }
        if(result.res.code === 'K-000000') {
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));
          history.go(-1)
          //重置一下key的值
          id = 0
        }
      }
    });
  };

  render(){
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
        sm: { span: 16, offset: 8 },
      },
    };

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { title } = this.state

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? <FormattedMessage id="Product.Synonyms(asf)" /> : ''}
        required={true}
        key={k.id}
      >
        {getFieldDecorator(`synonyms[${k.id}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          initialValue:k.value,
          rules: [
            {
              required: true,
              message: RCi18n({id:'Product.PleaseInputSynonyms'}),
            },
          ],
        })(<Input style={{ width: '80%', marginRight: 8 }} />)}
        <span>
            {
              keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k.id)}
                />
              ) : null
            }
          <Icon type="plus-circle" onClick={() => this.add()} style={{marginLeft:8}}/>
        </span>
      </Form.Item>
    ));
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={title} />
          <div style={{width:800}}>
            <Form {...formItemLayout}>
              <FormItem label={<FormattedMessage id="Product.SearchPhrase" />}>
                {getFieldDecorator('phrase', {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.PleaseInputPhrase'})
                    },
                  ]
                })(
                  <Input style={{ width: '80%', marginRight: 8 }} />
                )}
              </FormItem>
              {formItems}
            </Form>
          </div>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: 10 }}>
            <FormattedMessage id="Product.Save"/>
          </Button>
          <Button style={{ marginRight: 10 }} onClick={()=>{
            history.go(-1)
            id = 0
          }}>
            <FormattedMessage id="Product.Cancel" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(AddSynonyms);