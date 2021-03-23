import * as React from 'react';
import { fromJS, List } from 'immutable';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Icon } from 'antd';
import { Const, history, QMMethod, util, cache, ValidConst } from 'qmkit';
import moment from 'moment';
import { GoodsModal } from 'biz';
import SelectedFixedPriceProducts from './selected-fixed-price-products';
import * as webapi from '../webapi';
import * as Enum from './marketing-enum';

import { doc } from 'prettier';
// import debug = doc.debug;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

const largeformItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 10
  }
};
const radioStyle = {
  display: 'block',
  height: '40px',
  lineHeight: '40px'
};
export default class TestForm extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    const relaxProps = props.store.state();
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _selectedSkuIds: [],
        _selectedRows: []
      },
      //营销活动已选的商品信息
      selectedSkuIds: [],
      selectedRows: fromJS([]),
      //全部等级
      customerLevel: [],
      //选择的等级
      selectedLevelIds: [],
      //营销实体
      marketingBean: relaxProps.get('marketingBean'),
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false
      },
      //满金额还是满数量
      isFullCount: null,
      //已经存在于其他同类型的营销活动的skuId
      skuExists: [],
      saveLoading: false,
      promotionCode: '',
      promotionCode2: '', //记录初始自动生成的promotionCode
      PromotionTypeValue: 0,
      PromotionTypeChecked: true,
      timeZone: moment,
      isClubChecked: false,
      allGroups: relaxProps.get('allGroups')
    };
  }

  componentDidMount() {}
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  // @ts-ignore
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}
