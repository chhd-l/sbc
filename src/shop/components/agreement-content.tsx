import React from 'react';
import { Relax } from 'plume2';

import { Button, Checkbox } from 'antd';
import { noop } from 'qmkit';
import styled from 'styled-components';
import Header from './head';

const Box = styled.div`
  border: 1px solid #e9e9e9;
  padding: 20px;
  margin-bottom: 25px;
  max-height: calc(100vh - 430px);
  overflow: auto;
  h4 {
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
  p {
    color: #666666;
    font-size: 12px;
    margin-top: 20px;
    span {
      display: block;
    }
  }
`;
const BottomCon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-checkbox-wrapper {
    color: #333333;
    margin-bottom: 25px;
  }
`;
@Relax
export default class AgreementContent extends React.Component<any, any> {
  props: {
    relaxProps?: {
      agree: boolean;
      businessEnter: string;
      agreeOrNot: Function;
      passAgree: Function;
    };
  };

  static relaxProps = {
    // 是否同意注册协议
    agree: 'agree',
    // 商家入驻协议详情
    businessEnter: 'businessEnter',
    // 同意/拒绝 注册协议
    agreeOrNot: noop,
    // 通过注册协议
    passAgree: noop
  };

  render() {
    const {
      agree,
      agreeOrNot,
      passAgree,
      businessEnter
    } = this.props.relaxProps;
    return (
      <div>
        <Header postTxt="您没有开店噢，请提交您的开店申请" />
        <div className="shopContent">
          <h1>申请开店</h1>
          <Box>
            <div
              className="businessEnter"
              dangerouslySetInnerHTML={{ __html: businessEnter }}
            />
          </Box>
          <BottomCon>
            <Checkbox checked={agree} onChange={() => agreeOrNot()}>
              我已阅读并同意商家入驻协议
            </Checkbox>
            {agree ? (
              <Button type="primary" size="large" onClick={() => passAgree()}>
                下一步
              </Button>
            ) : (
              <Button type="primary" size="large" disabled>
                下一步
              </Button>
            )}
          </BottomCon>
        </div>
      </div>
    );
  }
}
