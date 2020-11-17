import React from 'react';
import { Form, Input, Checkbox, Row, Col } from 'antd';
import Upload from './upload';
const FormItem = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};

export default class BasicInformation extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
    this.setImageUrl = this.setImageUrl.bind(this);
  }

  setImageUrl(url) {
    this.props.addField('imageLink', url);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigation, noLanguageSelect } = this.props;
    return (
      <div>
        <h3>{noLanguageSelect ? 'Step1' : 'Step2'}</h3>
        <h4>
          Basic Information<span className="ant-form-item-required"></span>
        </h4>
        <div className="basicInformation">
          <Form>
            <FormItem {...layout} label="Navigation Name">
              {getFieldDecorator('navigationName', {
                initialValue: navigation.navigationName,
                rules: [{ required: true, message: 'Please input Navigation Name' }]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.props.addField('navigationName', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Navigation Link">
              {getFieldDecorator('navigationLink', {
                initialValue: navigation.navigationLink
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.props.addField('navigationLink', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Navigation Description">
              {getFieldDecorator('navigationDesc', {
                initialValue: navigation.navigationDesc
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.props.addField('navigationDesc', value);
                  }}
                />
              )}
            </FormItem>
            <Row>
              <Col span={4}>
                <div className="uploadTip">Recommened size：800*800px the size of a single sheet does not exceed 2M，and the maximum sheets is 10</div>
              </Col>
            </Row>
            <FormItem {...layout} label="Picture Image">
              <Upload form={this.props.form} setUrl={this.setImageUrl} defaultValue={navigation.imageLink} />
            </FormItem>
            <FormItem>
              <Checkbox
                checked={navigation.enable === 1 ? true : false}
                onChange={(e) => {
                  navigation.enable = e.target.checked ? 1 : 0;
                  this.props.addField('enable', navigation.enable);
                }}
              >
                Enable
              </Checkbox>
              <span className="checkBoxTip">Menu items that are not enabled will not be listed in any menu</span>
            </FormItem>
            {this.props.noLanguageSelect ? null : (
              <FormItem>
                <Checkbox
                  checked={navigation.expanded === 1 ? true : false}
                  onChange={(e) => {
                    navigation.expanded = e.target.checked ? 1 : 0;
                    this.props.addField('expanded', navigation.expanded);
                  }}
                >
                  Expanded
                </Checkbox>
                <span className="checkBoxTip">Menu items that are not enabled will not be listed in any menu</span>
              </FormItem>
            )}
          </Form>
        </div>
      </div>
    );
  }
}
