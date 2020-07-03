import React from 'react';
import { Relax, IMap } from 'plume2';

import { Button, Modal, message } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid } from 'qmkit';
import { IList } from 'typings/globalType';
import { Table } from 'antd';

const Column = Table.Column;
import { FormattedMessage } from 'react-intl';

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
  padding-bottom: 10px;
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
      brandModal: Function;
      sortModal: Function;
      setCurrentStep: Function;
      company: IMap;
      contractBrandList: IMap;
      renewAll: Function;
      otherBrands: IList;
      allBrands: any;
    };
  };

  static relaxProps = {
    // 品牌弹框
    brandModal: noop,
    // 分类弹框
    sortModal: noop,
    //设置当前页
    setCurrentStep: noop,
    company: 'company',
    contractBrandList: 'contractBrandList',
    renewAll: noop,
    otherBrands: 'otherBrands',
    allBrands: 'allBrands'
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company, otherBrands } = this.props.relaxProps;
    const checkBrand = company.get('checkBrand').toJS(); //商家自增的品牌
    const brandList = company.get('brandList').toJS(); //已审核的品牌
    const cateList = company.get('cateList').toJS();
    const totalBrand = brandList.length + otherBrands.toJS().length; //总的签约品牌数量

    return (
      <div id="contract-table">
        <Content>
          <div>
            <Red>*</Red>
            <H2>
              <FormattedMessage id="signedCategory" />
            </H2>
            <GreyText>
              {cateList.length} <FormattedMessage id="signedCategoryInfo" />
            </GreyText>
            <Button onClick={this._showSortsModal}>
              Edit Contract Category
            </Button>
          </div>
          <TableBox>
            <DataGrid
              dataSource={cateList}
              scroll={{ y: 240 }}
              pagination={false}
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
                title={<FormattedMessage id="categoryDeductionRate" />}
                dataIndex="cateRate"
                key="cateRate"
                width="15%"
                render={(text) => {
                  return (
                    <div>
                      <span style={{ width: 50 }}>{text}</span>&nbsp;%
                    </div>
                  );
                }}
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
            <GreyText>已签约{totalBrand}个品牌 最多可签约50个品牌</GreyText>
            <Button onClick={this._showModal}>编辑签约品牌</Button>
          </div>
          <TableBox>
            <DataGrid
              dataSource={brandList}
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="品牌名称"
                dataIndex="brandName"
                key="brandName"
                width="15%"
              />
              <Column
                title="品牌别名"
                dataIndex="nickName"
                key="nickName"
                width="20%"
                render={(text) => {
                  return text ? <span>{text}</span> : <span>-</span>;
                }}
              />
              <Column
                title="品牌logo"
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
                title="授权文件"
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
            {checkBrand.length == 0 ? null : (
              <DataGrid
                dataSource={checkBrand}
                rowKey="contractBrandId"
                scroll={{ y: 240 }}
                pagination={false}
              >
                <Column
                  title="商家自增"
                  dataIndex="name"
                  key="name"
                  width="15%"
                />
                <Column dataIndex="nickName" key="nickName" width="20%" />
                <Column
                  dataIndex="logo"
                  key="logo"
                  width="15%"
                  render={(text, record: any) => {
                    return text ? (
                      <img
                        src={record.logo}
                        width="140"
                        height="50"
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: record.logo })
                        }
                      />
                    ) : (
                      <span>-</span>
                    );
                  }}
                />
                <Column
                  dataIndex="authorizePic"
                  key="authorizePic"
                  width="50%"
                  render={(text) => {
                    let images = text ? text : [];
                    return images.length > 0 ? (
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
                    ) : (
                      <span>-</span>
                    );
                  }}
                />
              </DataGrid>
            )}
          </TableBox>
        </Content>
        <Content>
          <Button type="primary" onClick={this._next}>
            下一步
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this._prev}>
            上一步
          </Button>
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

  /**
   * 显示品牌弹框
   */
  _showModal = () => {
    const { brandModal } = this.props.relaxProps;
    brandModal();
  };

  /**
   * 显示类目弹框
   */
  _showSortsModal = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * 下一步
   */
  _next = () => {
    const { allBrands, renewAll, company } = this.props.relaxProps;
    const checkBrand = company.get('checkBrand').toJS();
    let repeatPlatForm;
    let count = 0;
    //判重
    if (checkBrand.length > 0) {
      checkBrand.map((item) => {
        repeatPlatForm = allBrands
          .toJS()
          .filter((v) => v.brandName == item.name);
        if (repeatPlatForm.length > 0) {
          count++;
        }
      });
    }
    if (count == 0) {
      renewAll();
    } else {
      message.error('自定义品牌与平台品牌重复！');
    }
  };

  /**
   * 上一步
   */
  _prev = () => {
    const { setCurrentStep } = this.props.relaxProps;
    setCurrentStep(1);
  };

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };
}
