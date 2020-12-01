import { IList } from 'typings/globalType';
import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Form, Row, Col, Select, Tree, TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

@Relax
export default class GoodsPropDetail extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      changePropVal: Function;
      propList: IList;
      propDetail: IList;
    };
  };

  static relaxProps = {
    changePropVal: noop,
    propList: 'propList',
    propDetail: 'propDetail'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { propList } = this.props.relaxProps;
    return (
      <div>
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          <FormattedMessage id="product.attributeInformation" />
          <span style={{ marginLeft: 10, fontSize: 10, color: '#86877F' }}>
            <FormattedMessage id="product.attributeInformationDetail" />
          </span>
        </div>
        <div>
          <Form>
            {propList &&
              propList.map((detList) => {
                return (
                  <Row type="flex" justify="start" key={detList.get(0).get('propId')}>
                    {detList.map((det) => (
                      <Col span={10} key={det.get('propId') + det.get('cateId')}>
                        <FormItem {...formItemLayout} label={det.get('propName')}>
                          {/* {this._getPropSelect(
                            det.get('goodsPropDetails'),
                            det.get('propId')
                          )} */}
                          {this._getPropTree(det.get('goodsPropDetails'), det.get('propId'), det.get('isSingle'))}
                        </FormItem>
                      </Col>
                    ))}
                  </Row>
                );
              })}
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 获取属性值下拉框
   */
  _getPropSelect = (propValues, propId) => {
    const propVal = propValues.find((item) => item.get('select') === 'select');
    const selected = propVal ? propVal.get('detailId') : '0';
    console.log(selected, 'selected');
    return (
      <Select getPopupContainer={() => document.getElementById('page-content')} defaultValue={selected} onChange={(value) => this._onChange(propId, value)}>
        {propValues.map((item) => {
          return (
            <Option key={item.get('detailId')} value={item.get('detailId')}>
              {item.get('detailName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  _getPropTree = (propValues, propId, isSingle) => {
    const propVals = propValues.filter((item) => item.get('select') === 'select');
    const selected = propVals.length
      ? propVals.toJS().map((item) => {
          return {
            label: item.detailName,
            value: item.detailId
          };
        })
      : [];
    return (
      <TreeSelect
        getPopupContainer={() => document.getElementById('page-content')}
        treeCheckable={true}
        showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
        treeCheckStrictly={true}
        placeholder="Select the property information"
        notFoundContent="No Data"
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeDefaultExpandAll
        showSearch={false}
        defaultValue={selected}
        onChange={(value) => this._onChange(propId, value)}
      >
        {this.generateStoreCateTree(propValues,isSingle)}
      </TreeSelect>
    );
  };

  /**
   * 店铺分类树形下拉框
   * @param propValues
   */
  generateStoreCateTree = (propValues, isSingle) => {
    const { propDetail } = this.props.relaxProps
    const propDetails = propDetail ? propDetail.toJS() : []
    const selectList = []
    propDetails.map(p=>{
      p.goodsPropDetails &&  p.goodsPropDetails.map(x=>{
        if(x.select === 'select') {
          selectList.push(x.detailId)
        }
      })
    })
    const values = propValues ? (propValues.toJS()).map(x=>x.detailId) : []
    let intersection = values.filter((v) => selectList.includes(v));
    return propValues.map((item) => {
      const singleDisabled = isSingle && intersection.length > 0 && item.get('detailId') != intersection[0]
      return <TreeNode key={item.get('detailId')} value={item.get('detailId')} title={item.get('detailName')} disabled={singleDisabled}/>;
    });
  };

  /**
   *
   */
  _onChange = (propId, detailIds) => {
    const { changePropVal } = this.props.relaxProps;
    changePropVal({ propId, detailIds: detailIds.map((d) => d.value) });
  };
}
