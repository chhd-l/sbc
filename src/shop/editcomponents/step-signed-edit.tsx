import React from 'react';
import { Relax, IMap } from 'plume2';

import { Button, Modal, message, DatePicker, Radio } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid } from 'qmkit';
import moment from 'moment';
import { IList } from 'typings/globalType';

const RadioGroup = Radio.Group;
import { Table } from 'antd';

const Column = Table.Column;
const { RangePicker } = DatePicker;

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
      onChange: Function;
      company: IMap;
      contractBrandList: IMap;
      storeRenewAll: Function;
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
    onChange: noop,
    company: 'company',
    contractBrandList: 'contractBrandList',
    storeRenewAll: noop,
    otherBrands: 'otherBrands',
    allBrands: 'allBrands'
  };

  UNSAFE_componentWillMount() {
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
    const storeInfo = company.get('storeInfo');

    return (
      <div id="contract-table">
        <Content>
          <div>
            <Red>*</Red>
            <H2>Signing Categories</H2>
            <GreyText>Signed {cateList.length} Categories, Can sign up to 200 categories</GreyText>
            <Button onClick={this._showSortsModal} disabled>
              Edit Contract Category
            </Button>
          </div>
          <TableBox>
            <DataGrid dataSource={cateList} scroll={{ y: 240 }} pagination={false}>
              <Column title="Category" dataIndex="cateName" key="cateName" width="15%" />
              <Column title="Superior Category" dataIndex="parentGoodCateNames" key="parentGoodCateNames" width="20%" />
              <Column
                title="Category Deduction Rate"
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
                title="Business Qualification"
                dataIndex="qualificationPics"
                key="qualificationPics"
                width="50%"
                render={(text) => {
                  let images = text ? text.split(',') : [];
                  return images.length > 0 ? (
                    <PicBox>
                      {images.map((v, k) => {
                        return <img src={v} key={k} alt="" onClick={() => this.setState({ showImg: true, imgUrl: v })} />;
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
            <GreyText>Signed {totalBrand} brand, Up to 50 brands can be signed</GreyText>
            <Button onClick={this._showModal} disabled>
              Edit Contracted Brand
            </Button>
          </div>
          <TableBox>
            <DataGrid dataSource={brandList} scroll={{ y: 240 }} pagination={false}>
              <Column title="Brand Name" dataIndex="brandName" key="brandName" width="15%" />
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
                      <img src={text} key={i} alt="" onClick={() => this.setState({ showImg: true, imgUrl: text })} />
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
                        return <img src={v.url} key={k} alt="" onClick={() => this.setState({ showImg: true, imgUrl: v.url })} />;
                      })}
                    </PicBox>
                  );
                }}
              />
            </DataGrid>
            {checkBrand.length == 0 ? null : (
              <DataGrid dataSource={checkBrand} rowKey="contractBrandId" scroll={{ y: 240 }} pagination={false}>
                <Column title="Shop increase" dataIndex="name" key="name" width="15%" />
                <Column dataIndex="nickName" key="nickName" width="20%" />
                <Column
                  dataIndex="logo"
                  key="logo"
                  width="15%"
                  render={(text, record: any) => {
                    return text ? <img src={record.logo} width="140" height="50" alt="" onClick={() => this.setState({ showImg: true, imgUrl: record.logo })} /> : <span>-</span>;
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
                          return <img src={v.url} key={k} alt="" onClick={() => this.setState({ showImg: true, imgUrl: v.url })} />;
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
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>Signing Period</H2>
            <GreyText>Merchant store validity</GreyText>
          </div>
          <RangePicker value={[moment(storeInfo.get('contractStartDate')), moment(storeInfo.get('contractEndDate'))]} format="YYYY-MM-DD HH:mm:ss" disabled />
        </Content>
        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>shop Type</H2>
          </div>
          <RadioGroup value={storeInfo.get('companyType')}>
            {storeInfo.get('companyType') == 0 ? (
              <Radio value={0} checked={true} disabled>
                Self-employed Shop
              </Radio>
            ) : (
              <Radio value={1} checked={true} disabled>
                Third-party Shop
              </Radio>
            )}
          </RadioGroup>
        </Content>
        {!storeInfo.get('storeId') && (
          <Content>
            <Button type="primary" onClick={this._next}>
              Save
            </Button>
          </Content>
        )}
        <Modal maskClosable={false} visible={this.state.showImg} footer={null} onCancel={() => this._hideImgModal()}>
          <div>
            <div>
              <img style={{ width: '100%', height: '100%' }} src={this.state.imgUrl} />
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
   * 保存
   */
  _next = () => {
    const { allBrands, storeRenewAll, company } = this.props.relaxProps;
    const checkBrand = company.get('checkBrand').toJS();
    let repeatPlatForm;
    let count = 0;
    //判重
    if (checkBrand.length > 0) {
      checkBrand.map((item) => {
        repeatPlatForm = allBrands.toJS().filter((v) => v.brandName == item.name);
        if (repeatPlatForm.length > 0) {
          count++;
        }
      });
    }
    if (count == 0) {
      storeRenewAll();
    } else {
      message.error('Custom brand repeats with platform brand!');
    }
  };

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };
}
