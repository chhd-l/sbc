import React from 'react';
import { Form, Input, Checkbox, Row, Col } from 'antd';
import { AssetManagement } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';
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
    this.updateImg = this.updateImg.bind(this);
    this.deleteImg = this.deleteImg.bind(this);
  }

  updateImg = (images) => {
    let imageString = images && images.length > 0 ? images[0] : '';
    this.props.addField('imageLink', imageString);
  };

  deleteImg = (item) => {
    this.props.addField('imageLink', '');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigation, noLanguageSelect } = this.props;
    let testlink = /^\/.*/;
    return (
      <div>
        <h3>
          {noLanguageSelect ? (
            <FormattedMessage id="Content.Step1" />
          ) : (
            <FormattedMessage id="Content.Step2" />
          )}
        </h3>
        <h4>
          <FormattedMessage id="Content.BasicInformation" />
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="basicInformation">
          <Form>
            <FormItem {...layout} label={<FormattedMessage id="Content.NavigationName" />}>
              {getFieldDecorator('navigationName', {
                initialValue: navigation.navigationName,
                rules: [
                  {
                    required: true,
                    message: <FormattedMessage id="Content.PleaseInputNavigationName" />
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (this.props.topNames && this.props.topNames.includes(value)) {
                        callback(
                          <FormattedMessage id="Content.ToplevelNavigationCannotBeRepeated" />
                        );
                      } else {
                        callback();
                      }
                    }
                  }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.props.addField('navigationName', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label={<FormattedMessage id="Content.NavigationLink" />}>
              {getFieldDecorator('navigationLink', {
                initialValue: navigation.navigationLink,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (testlink.test(value)) {
                        callback();
                      } else {
                        callback(<FormattedMessage id="Content.NavigationLinkRoute" />);
                      }
                      // webapi.getSeoNavigation(value).then((res) => {
                      //   let { id } = res.res.context.seoSettingVO;
                      //   if (id) {
                      //     callback(<FormattedMessage id="Content.NavigationLinkTips" />);
                      //   } else if (testlink.test(value)) {
                      //     callback();
                      //   } else {
                      //     callback(<FormattedMessage id="Content.NavigationLinkRoute" />);
                      //   }
                      // });
                    }
                  }
                ]
              })(
                <Input
                  data-testid="basicTest"
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.props.addField('navigationLink', value);
                  }}
                />
              )}
              <span className="tip ant-form-item-required">
                <FormattedMessage id="Content.URLLike" />
              </span>
            </FormItem>
            <FormItem {...layout} label={<FormattedMessage id="Content.NavigationDescription" />}>
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
                <div className="uploadTip">
                  <FormattedMessage id="Content.RecommenedSize" />
                </div>
              </Col>
            </Row>
            <FormItem {...layout} label={<FormattedMessage id="Content.PictureImage" />}>
              <AssetManagement
                choosedImgCount={1}
                images={navigation.imageLink ? [navigation.imageLink] : []}
                selectImgFunction={this.updateImg}
                deleteImgFunction={this.deleteImg}
              />
            </FormItem>
            <FormItem>
              <Checkbox
                checked={navigation.enable === 1 ? true : false}
                onChange={(e) => {
                  navigation.enable = e.target.checked ? 1 : 0;
                  this.props.addField('enable', navigation.enable);
                }}
              >
                <FormattedMessage id="Content.Enable" />
              </Checkbox>
              <span className="checkBoxTip">
                <FormattedMessage id="Content.MenuItems" />
              </span>
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
                  <FormattedMessage id="Content.Expanded" />
                </Checkbox>
                <span className="checkBoxTip">
                  <FormattedMessage id="Content.theMenuWill" />
                </span>
              </FormItem>
            )}
          </Form>
        </div>
      </div>
    );
  }
}
