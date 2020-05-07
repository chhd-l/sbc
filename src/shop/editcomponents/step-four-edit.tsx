import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tag } from 'antd';
import styled from 'styled-components';
import { DataGrid } from 'qmkit';

const { Column } = DataGrid;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
`;

const NoBorder = styled.div`
  tr > td {
    border-bottom: none;
  }
`;

const AddBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  h2 {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
  }

  > div {
    width: 500px;
  }
`;
const BlueText = styled.span`
  color: #f56c1d;
  font-weight: bold;
`;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const offlineAccount = company.get('offlineAccount');
    const accountDays = company.get('accountDays').toJS();

    return (
      <div>
        <Content>
          <div>
            <Red>*</Red>
            <H2>结算日</H2>
            <GreyText>
              已添加{accountDays ? accountDays.length : 0}
              个结算日，最多可添加5个结算日
            </GreyText>
          </div>

          <AddBox>
            <h2>每月：</h2>
            <div>
              <div>
                {accountDays.length > 0
                  ? accountDays.map((v, i) => {
                      return (
                        <Tag key={i}>
                          <BlueText>{v}</BlueText>
                        </Tag>
                      );
                    })
                  : null}
                日
                <GreyText>
                  当月不包含所设日期时，将会顺延到下一个结算日
                </GreyText>
              </div>
            </div>
          </AddBox>
        </Content>

        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
            <GreyText>
              已添加{offlineAccount ? offlineAccount.count() : 0}
              个结算账户，最多可添加5个结算账户，如需修改结算账户请在财务模块操作
            </GreyText>
          </div>
        </Content>

        <Content>
          <NoBorder>
            <DataGrid
              dataSource={offlineAccount.toJS()}
              pagination={false}
              rowKey="accountId"
            >
              <Column
                title="序号"
                dataIndex="accountId"
                key="accountId"
                render={(_text, _rowData: any, index) => {
                  return index + 1;
                }}
              />
              <Column title="银行" dataIndex="bankName" key="bankName" />
              <Column
                title="账户名"
                dataIndex="accountName"
                key="accountName"
              />
              <Column title="账号" dataIndex="bankNo" key="bankNo" />
              <Column title="支行" dataIndex="bankBranch" key="bankBranch" />
              <Column
                title="收到平台打款"
                dataIndex="isReceived"
                key="isReceived"
                render={(isReceived) => (isReceived == 1 ? '已验证' : '未验证')}
              />
              <Column
                title="主账号"
                align="center"
                dataIndex="isDefaultAccount"
                key="isDefaultAccount"
                render={(isDefaultAccount) =>
                  isDefaultAccount == 1 ? '是' : '否'
                }
              />
            </DataGrid>
          </NoBorder>
        </Content>
      </div>
    );
  }
}
