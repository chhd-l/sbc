import React from 'react';
import { Modal } from 'antd';
import { List } from 'immutable';
import styled from 'styled-components';
import { DataGrid } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { FormattedMessage } from 'react-intl';
declare type IList = List<any>;

import { Table } from 'antd';

const Column = Table.Column;

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
const TableBox = styled.div`
  padding-top: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepThree extends React.Component<any, any> {
  props: {
    relaxProps?: {
      company: IMap;
      checkInfo: IMap;
      otherBrands: IList;
    };
  };

  static relaxProps = {
    company: 'company',
    checkInfo: 'checkInfo'
  };

  UNSAFE_componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company } = this.props.relaxProps;
    const cateList = company.get('cateList').toJS();
    const brandList = company.get('brandList').toJS();
    const checkBrand = company.get('checkBrand').toJS(); //商家自增的品牌
    return (
      <div id="contract-table">
        <Content>
          <div>
            <Red>*</Red>
            <H2>
              <FormattedMessage id="signedCategory" />
            </H2>
            <GreyText>
              {cateList ? cateList.length : 0}{' '}
              <FormattedMessage id="signedCategoryInfo" />
            </GreyText>
          </div>
          <TableBox>
            <DataGrid
              dataSource={cateList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="contractCateId"
            >
              <Column
                title={<FormattedMessage id="category" />}
                dataIndex="cateName"
                key="cateName"
                width="15%"
              />
              <Column
                title={<FormattedMessage id="superiorCategory" />}
                dataIndex="parentGoodCateNames"
                key="parentGoodCateNames"
                width="20%"
              />
              <Column
                align="left"
                title={<FormattedMessage id="businessQualification" />}
                dataIndex="qualificationPics"
                key="qualificationPics"
                width="50%"
                render={(text) => {
                  let images = text ? text.split(',') : [];
                  return images.length > 0 ? (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>Signed Brand</H2>
            <GreyText>
              Signed {brandList ? brandList.length + checkBrand.length : 0}{' '}
              brands Up to 50 brands can be signed
            </GreyText>
          </div>
          <TableBox>
            <DataGrid
              rowKey="contractBrandId"
              dataSource={brandList}
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="Brand Name"
                dataIndex="brandName"
                key="brandName"
                width="15%"
              />
              <Column
                title="Brand Alias"
                dataIndex="nickName"
                key="nickName"
                width="20%"
                render={(text) => {
                  return text ? <span>{text}</span> : <span>-</span>;
                }}
              />
              <Column
                title="Brand Logo"
                dataIndex="logo"
                key="log"
                width="15%"
                render={(text, _record: any, i) => {
                  return text ? (
                    <PicBox>
                      <img
                        src={text}
                        key={i}
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: text })
                        }
                      />
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
              <Column
                title="Authorization Document"
                dataIndex="authorizePic"
                key="authorizePic"
                width="50%"
                render={(text) => {
                  let images = text ? text : [];
                  return (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v.url}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v.url })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  );
                }}
              />
            </DataGrid>
            {company.get('storeInfo').get('auditState') == 1 ? null : (
              <div>
                <DataGrid
                  dataSource={checkBrand}
                  rowKey="contractBrandId"
                  scroll={{ y: 240 }}
                  pagination={false}
                >
                  <Column
                    title="Shop Increase"
                    dataIndex="name"
                    key="name"
                    width="15%"
                  />
                  <Column dataIndex="nickName" key="nickName" width="20%" />
                  <Column
                    dataIndex="logo"
                    key="logo"
                    width="15%"
                    render={(text, _record: any, i) => {
                      return (
                        <PicBox>
                          <img
                            src={text}
                            key={i}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: text })
                            }
                          />
                        </PicBox>
                      );
                    }}
                  />
                  <Column
                    dataIndex="authorizePic"
                    key="authorizePic"
                    width="50%"
                    render={(text) => {
                      let images = text ? text : [];
                      return (
                        <PicBox>
                          {images.map((v, k) => {
                            return (
                              <img
                                src={v.url}
                                key={k}
                                alt=""
                                onClick={() =>
                                  this.setState({
                                    showImg: true,
                                    imgUrl: v.url
                                  })
                                }
                              />
                            );
                          })}
                        </PicBox>
                      );
                    }}
                  />
                </DataGrid>
              </div>
            )}
          </TableBox>
        </Content>
        <Modal
          maskClosable={false}
          visible={this.state.showImg}
          footer={null}
          onCancel={() => this._hideImgModal()}
        >
          <div>
            <div>
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.imgUrl}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };
}
