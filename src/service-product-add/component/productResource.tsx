import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Col, Form, Input, message, Modal, Radio, Row, Select, Tree, TreeSelect } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, QMMethod, Tips, ValidConst, SelectGroup } from 'qmkit';
import { fromJS, Map } from 'immutable';

import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';

const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

@Relax
export default class Resources extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goods: IMap;
      editGoods: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(ResourceForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return (
      <WrapperForm
        ref={(form) => (this['_form'] = form)}
        //ref={(form) => updateGoodsForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class ResourceForm extends React.Component<any, any> {
  
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods } = this.props.relaxProps;
    
    return (
      <Form>
        {/* The first line */}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.Assigntheresources" />}>
              {getFieldDecorator('assignType', {
                rules: [],
                onChange: this._editGoods.bind(this, 'assignType'),
                initialValue: goods.get('assignType')
              })(
                <RadioGroup>
                  <Radio value={1}><FormattedMessage id="Product.Assignrandomly" /></Radio>
                  <Radio value={2}><FormattedMessage id="Product.Assignprioritized" /></Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  
  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods } = this.props.relaxProps;

    if (e && e.target) {
      e = e.target.value;
    }

    let goods = Map({
      [key]: fromJS(e)
    });
    editGoods(goods);
  };
  
}
