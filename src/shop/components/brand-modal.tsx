import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Modal, Input, Row, Col, Icon, Tooltip, Form, message } from 'antd';

import styled from 'styled-components';
import { noop, DataGrid, QMUpload, QMMethod, Const, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import Button from 'antd/lib/button/button';

const FILE_MAX_SIZE = 2 * 1024 * 1024;
const Search = Input.Search;
import { Table } from 'antd';

const Column = Table.Column;
const FormItem = Form.Item;

interface TableBoxProps {
  primary?: boolean;
}

const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
`;
const RedPoint = styled.span`
  color: #e73333;
`;

const TableBox = styled.div`
  padding-top: ${(props: TableBoxProps) => (props.primary ? '10px' : 0)};

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`;

@Relax
export default class BrandModal extends React.Component<any, any> {
  _form: any;

  constructor(props) {
    super(props);
  }

  state = {
    fileList: false
  };

  props: {
    form: any;
    relaxProps?: {
      brandVisible: boolean;
      brandModal: Function;
      allBrands: any;
      addBrand: Function;
      company: IMap;
      otherBrands: IList;
      addNewOtherBrand: Function; //新增自定义品牌
      deleteOtherBrand: Function; //删除自定义品牌
      onBrandInputChange: Function; //编辑品牌输入框
      changeBrandImg: Function; //上传已有品牌授权文件
      changeOtherBrandImg: Function; //上传自定义品牌授权文件
      changeLogoImg: Function; //上传自定义品牌的logo
      deleteBrand: Function; //删除勾选的平台品牌
      saveBrandEdit: Function; //保存品牌编辑
      fetchSignInfo: Function;
      filterBrandName: Function; //根据名称检索
    };
  };

  static relaxProps = {
    // 弹框是否显示
    brandVisible: 'brandVisible',
    // 关闭弹框
    brandModal: noop,
    //所有品牌
    allBrands: 'allBrands',
    addBrand: noop,
    company: 'company',
    otherBrands: 'otherBrands',
    addNewOtherBrand: noop,
    deleteOtherBrand: noop,
    onBrandInputChange: noop,
    changeBrandImg: noop,
    changeOtherBrandImg: noop,
    changeLogoImg: noop,
    deleteBrand: noop,
    saveBrandEdit: noop,
    fetchSignInfo: noop,
    filterBrandName: noop //根据名称检索
  };

  render() {
    const {
      brandVisible,
      allBrands,
      company,
      otherBrands,
      addNewOtherBrand,
      deleteOtherBrand,
      onBrandInputChange,
      filterBrandName
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const brandList = company.get('brandList').toJS();

    const totalBrand = brandList.length + otherBrands.toJS().length; //总的签约品牌数量
    let brandIdArray = new Array();
    //brandList扁平化处理
    if (brandList.length > 0) {
      brandList.map((v) => {
        brandIdArray.push(v.brandId);
      });
    }
    if (!brandVisible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            Edit Contracted Brand
            <GreyText>
              Signed {totalBrand}
              Brand，Up to 50 brands can be signed, and the approval rate for
              uploading authorization documents is higher.
            </GreyText>
          </div>
        }
        visible={brandVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOK}
        width={1080}
      >
        <Form layout="inline">
          <Row>
            <Col span={6} style={styles.selectBrand}>
              <h3 style={{ marginBottom: 5 }}>Choose Platform Brand</h3>
              <div style={{ paddingRight: 10 }}>
                <Search
                  placeholder=" Please enter the brand name"
                  onChange={(e) => filterBrandName(e.target.value)}
                />
                <div
                  style={{
                    height: 470,
                    overflowY: 'scroll',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    background: '#fff',
                    paddingBottom: 10,
                    paddingTop: 10
                  }}
                >
                  <ul>
                    {allBrands.toJS().map((v) => (
                      <li
                        style={
                          brandIdArray.indexOf(v.brandId) == -1
                            ? styles.li
                            : styles.liBlue
                        }
                        key={v.brandId}
                        onClick={() => this._addBrand(v)}
                      >
                        <div>{v.brandName}</div>
                        {
                          //判断是否要显示勾号
                          brandIdArray.indexOf(v.brandId) == -1 ? null : (
                            <div style={{ marginRight: '10px' }}>
                              <i className="anticon anticon-check" />
                            </div>
                          )
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <TableBox>
                <DataGrid
                  dataSource={brandList}
                  scroll={{ y: 400 }}
                  pagination={false}
                >
                  <Column
                    title={
                      <div>
                        <RedPoint>*</RedPoint>Brand Name
                      </div>
                    }
                    dataIndex="brandName"
                    key="brandName"
                    width="20%"
                  />
                  <Column
                    title={
                      <div>
                        <p>Brand Alias</p>
                        <GreyText>Alias or English name</GreyText>
                      </div>
                    }
                    dataIndex="nickName"
                    key="nickName"
                    width="20%"
                    render={(text) => {
                      return text ? <span>{text}</span> : <span>-</span>;
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <RedPoint>*</RedPoint>Brand Logo
                        <Tooltip title="Size 120px*50px, support jpg, jpeg, png, gif, no more than 50kb">
                          &nbsp;
                          <Icon
                            type="question-circle-o"
                            style={{ color: '#F56C1D' }}
                          />
                        </Tooltip>
                      </div>
                    }
                    dataIndex="logo"
                    key="logo"
                    width="20%"
                    render={(text, record: any) => {
                      return text ? (
                        <img src={record.logo} width="140" height="50" alt="" />
                      ) : (
                        <span>-</span>
                      );
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <p>
                          <RedPoint>*</RedPoint>Authorization Document
                          <Tooltip title="Support jpg, jpeg, png, gif, single sheet no more than 2M, maximum upload 2 sheets">
                            &nbsp;
                            <Icon
                              type="question-circle-o"
                              style={{ color: '#F56C1D' }}
                            />
                          </Tooltip>
                        </p>
                        <GreyText>
                          Trademark registration certificate / acceptance letter
                          / brand authorization letter
                        </GreyText>
                      </div>
                    }
                    dataIndex="authorizePic"
                    key="authorizePic"
                    width="30%"
                    render={(text, record: any) => {
                      return (
                        <div>
                          <FormItem>
                            {getFieldDecorator(
                              `${record.brandId}_brand_authorizePic`,
                              {
                                initialValue: text,
                                rules: [{ validator: this.checkAuthImg }]
                              }
                            )(
                              <QMUpload
                                name="uploadFile"
                                style={styles.box}
                                listType="picture-card"
                                action={
                                  Const.HOST +
                                  '/store/uploadStoreResource?resourceType=IMAGE'
                                }
                                fileList={text ? text : []}
                                accept={'.jpg,.jpeg,.png,.gif'}
                                onChange={(info) =>
                                  this._editImages(
                                    info,
                                    record.contractId,
                                    record.brandId,
                                    'platForm'
                                  )
                                }
                              >
                                {(text ? text : []).length < 2 && (
                                  <Icon type="plus" style={styles.plus} />
                                )}
                              </QMUpload>
                            )}
                          </FormItem>
                        </div>
                      );
                    }}
                  />
                  <Column
                    title="Operating"
                    dataIndex="operation"
                    key="operation"
                    width="13%"
                    render={(_text, record: any) => {
                      return (
                        <a
                          href="#!"
                          onClick={() =>
                            this._deleteBrand(
                              record.contractBrandId,
                              record.brandId
                            )
                          }
                        >
                          Delete
                        </a>
                      );
                    }}
                  />
                </DataGrid>
              </TableBox>
              {company.get('storeInfo').get('auditState') == 1 ? null : (
                <TableBox primary>
                  <DataGrid
                    dataSource={
                      otherBrands.toJS().length > 0 ? otherBrands.toJS() : []
                    }
                    rowKey="key"
                    scroll={{ y: 400 }}
                    pagination={false}
                  >
                    <Column
                      title={
                        <div>
                          Custom Brand
                          {otherBrands.toJS().length == 0 ? (
                            <Button onClick={() => addNewOtherBrand()}>
                              Add custom brand
                            </Button>
                          ) : null}
                        </div>
                      }
                      width="20%"
                      dataIndex="name"
                      key="name"
                      render={(_text, record: any) => {
                        return (
                          <div>
                            <FormItem>
                              {getFieldDecorator(
                                record.key
                                  ? `${record.key}_name`
                                  : `${record.contractBrandId}_name`,
                                {
                                  initialValue: record.name,
                                  rules: [
                                    {
                                      pattern: ValidConst.noChar,
                                      message:
                                        'Special characters are not allowed'
                                    },
                                    {
                                      validator: (rule, value, callback) =>
                                        this._checkBrandName(
                                          rule,
                                          value,
                                          callback,
                                          record
                                        )
                                    }
                                  ]
                                }
                              )(
                                <Input
                                  style={{ width: 100 }}
                                  onChange={(e: any) =>
                                    onBrandInputChange({
                                      id: (record as any).key,
                                      contractId: (record as any)
                                        .contractBrandId,
                                      field: 'name',
                                      value: e.target.value
                                    })
                                  }
                                />
                              )}
                            </FormItem>
                          </div>
                        );
                      }}
                    />
                    <Column
                      width="20%"
                      dataIndex="nickName"
                      key="nickName"
                      render={(_text, record: any) => {
                        return (
                          <div>
                            <FormItem>
                              {getFieldDecorator(
                                record.key
                                  ? `${record.key}_nickName`
                                  : `${record.contractBrandId}_nickName`,
                                {
                                  initialValue: record.nickName,
                                  rules: [
                                    {
                                      validator: (rule, value, callback) => {
                                        QMMethod.validatorMinAndMax(
                                          rule,
                                          value,
                                          callback,
                                          'Brand alias',
                                          1,
                                          30
                                        );
                                      }
                                    }
                                  ]
                                }
                              )(
                                <Input
                                  style={{ width: 100 }}
                                  onChange={(e: any) =>
                                    onBrandInputChange({
                                      id: (record as any).key,
                                      contractId: (record as any)
                                        .contractBrandId,
                                      field: 'nickName',
                                      value: e.target.value
                                    })
                                  }
                                />
                              )}
                            </FormItem>
                          </div>
                        );
                      }}
                    />
                    <Column
                      width="20%"
                      dataIndex="logo"
                      key="logo"
                      render={(text, record: any) => {
                        let images;
                        if (text) {
                          if (text.length > 0 && typeof text != 'string') {
                            images = text;
                          } else {
                            images = [
                              { uid: 1, size: 1, url: text, name: 'logo' }
                            ];
                          }
                        } else {
                          images = [];
                        }
                        return (
                          <div>
                            <FormItem>
                              {getFieldDecorator(
                                record.key
                                  ? `${record.key}_logo`
                                  : `${record.contractBrandId}_logo`,
                                {
                                  initialValue: images.length > 0 ? images : '',
                                  rules: [{ validator: this.checkLogoImg }]
                                }
                              )(
                                <QMUpload
                                  beforeUpload={this._checkLogoUploadFile}
                                  name="uploadFile"
                                  style={styles.box}
                                  fileList={images}
                                  listType="picture-card"
                                  action={
                                    Const.HOST +
                                    '/store/uploadStoreResource?resourceType=IMAGE'
                                  }
                                  accept={'.jpg,.jpeg,.png,.gif'}
                                  onChange={(info) =>
                                    this._editLogos(
                                      info,
                                      record.contractBrandId,
                                      record.key
                                    )
                                  }
                                >
                                  {images.length < 1 && (
                                    <Icon type="plus" style={styles.plus} />
                                  )}
                                </QMUpload>
                              )}
                            </FormItem>
                          </div>
                        );
                      }}
                    />
                    <Column
                      width="30%"
                      dataIndex="authorizePic"
                      key="authorizePic"
                      render={(text, record: any) => {
                        return (
                          <div>
                            <FormItem>
                              {getFieldDecorator(
                                record.key
                                  ? `${record.key}_authorizePic`
                                  : `${record.contractBrandId}_authorizePic`,
                                {
                                  initialValue: text,
                                  rules: [{ validator: this.checkAuthImg }]
                                }
                              )(
                                <QMUpload
                                  beforeUpload={this._checkUploadFile}
                                  name="uploadFile"
                                  style={styles.box}
                                  fileList={text ? text : []}
                                  listType="picture-card"
                                  action={
                                    Const.HOST +
                                    '/store/uploadStoreResource?resourceType=IMAGE'
                                  }
                                  accept={'.jpg,.jpeg,.png,.gif'}
                                  onChange={(info) =>
                                    this._editImages(
                                      info,
                                      record.contractBrandId,
                                      record.key,
                                      'other'
                                    )
                                  }
                                >
                                  {(text ? text : []).length < 2 && (
                                    <Icon type="plus" style={styles.plus} />
                                  )}
                                </QMUpload>
                              )}
                            </FormItem>
                          </div>
                        );
                      }}
                    />
                    <Column
                      width="13%"
                      render={(_text, record: any) => {
                        return (
                          <div>
                            <a
                              href="#!"
                              style={{ marginRight: '5px' }}
                              onClick={() => addNewOtherBrand()}
                            >
                              新增
                            </a>
                            <a
                              href="#!"
                              onClick={() =>
                                deleteOtherBrand(
                                  record.contractBrandId,
                                  record.key
                                )
                              }
                            >
                              Delete
                            </a>
                          </div>
                        );
                      }}
                    />
                  </DataGrid>
                </TableBox>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { brandModal, fetchSignInfo } = this.props.relaxProps;
    //重置表单域各项值
    this.props.form.resetFields();
    //取消的时候，所有数据复原
    fetchSignInfo();
    brandModal();
  };

  /**
   * 上传
   * @param info
   * @param brandId
   * @private
   */
  _editLogos = (info, contractId, brandId) => {
    const { file, fileList } = info;
    if (file.status == 'error' || fileList == null) {
      message.error('Upload Failed');
      return;
    }
    const { changeLogoImg } = this.props.relaxProps;
    if (
      file.status == 'removed' ||
      fileList.length == 0 ||
      (fileList.length > 0 && this._checkLogoUploadFile(file))
    ) {
      changeLogoImg({ contractId, brandId, imgs: JSON.stringify(fileList) });
    }
  };

  /**
   * 上传平台品牌授权文件
   * @param info
   * @param brandId
   * @private
   */
  _editImages = (info, contractId, brandId, value) => {
    let { file, fileList } = info;
    if (file.status == 'error' || fileList == null) {
      message.error('Upload Failed');
      return;
    }
    const { changeBrandImg, changeOtherBrandImg } = this.props.relaxProps;
    if (
      file.status == 'removed' ||
      fileList.length == 0 ||
      (fileList.length > 0 && this._checkUploadFile(file))
    ) {
      if (value == 'platForm') {
        //上传平台品牌授权文件
        changeBrandImg({ contractId, brandId, imgs: JSON.stringify(fileList) });
      } else {
        //上传自定义品牌授权文件
        changeOtherBrandImg({
          contractId,
          brandId,
          imgs: JSON.stringify(fileList)
        });
      }
    }
  };

  /**
   * 检查logo格式
   */
  _checkLogoUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= 50 * 1024) {
        return true;
      } else {
        message.error('File size cannot exceed 50kb');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 检查授权文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('File size cannot exceed 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const { otherBrands, company } = this.props.relaxProps;
    const brandList = company.get('brandList').toJS();
    if (
      brandList.length +
        otherBrands.filter((v) => v.get('name') != '').toJS().length <
      1
    ) {
      //非空自定义品牌和选中的平台品牌加起来小于1时
      message.error('Please add at least one contracted brand');
    } else {
      //对非空的进行校验
      form.validateFields(null, (errs) => {
        //如果校验通过
        if (!errs) {
          this.props.relaxProps.saveBrandEdit();
        } else {
          this.setState({});
        }
      });
    }
  };

  //检查授权文件
  checkAuthImg = (_rule, value, callback) => {
    if (!value) {
      callback(new Error('Please upload the brand authorization file'));
      return;
    }
    if (!value[0] || !value[0].url) {
      if (!value.fileList || value.fileList.length == 0) {
        if (!value.length) {
          callback(new Error('Please upload the brand authorization file'));
          return;
        }
      }
    }
    callback();
  };

  //检查logo文件
  checkLogoImg = (_rule, value, callback) => {
    if (!value) {
      callback(new Error('Please upload the brand logo'));
      return;
    }
    if (!value[0] || !value[0].url) {
      if (value instanceof Array && value.length > 0) {
        callback();
        return;
      }
      if (!value.fileList || value.fileList.length == 0) {
        callback(new Error('Please upload the brand logo'));
        return;
      }
    }
    callback();
  };

  /**
   * 品牌名称的重复校验
   * @param rule
   * @param value
   * @param callback
   * @private
   */
  _checkBrandName = (_rule, value, callback, record) => {
    if (!value) {
      callback(new Error('Please input the brand name'));
      return;
    } else {
      if (value.length > 30 || value.length < 1) {
        callback(new Error('Brand length is between 1-30 characters'));
        return;
      } else {
        const { allBrands, otherBrands } = this.props.relaxProps;

        let repeatPlatForm = allBrands
          .toJS()
          .filter((v) => v.brandName == value);
        let repeatOther = otherBrands
          .toJS()
          .filter(
            (v) =>
              v.name == value &&
              ((v.contractBrandId &&
                v.contractBrandId != record.contractBrandId) ||
                (v.key && v.key != record.key))
          );
        if (repeatPlatForm.length == 0 && repeatOther.length == 0) {
          //无重复的
        } else {
          if (repeatPlatForm.length > 0) {
            callback(
              new Error(
                'Brand name duplicates existing brand name on the platform'
              )
            );
            return;
          }
          if (repeatOther.length > 0) {
            callback(new Error('Duplicate custom brand name'));
            return;
          }
        }
      }
    }
    callback();
  };

  _deleteBrand = (contractId, brandId) => {
    const { deleteBrand } = this.props.relaxProps;
    deleteBrand(contractId, brandId);
    this.props.form.resetFields();
  };

  _addBrand = (v) => {
    const { addBrand } = this.props.relaxProps;
    this.props.form.resetFields();
    addBrand(v);
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  li: {
    paddingTop: '5px',
    paddingBottom: '5px',
    marginBottom: '3px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  } as any,
  liBlue: {
    marginBottom: '3px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(232, 242, 249)',
    cursor: 'pointer'
  },
  selectBrand: {
    borderRight: '1px solid #e9e9e9',
    paddingTop: 24,
    marginTop: -24,
    paddingBottom: 24,
    marginBottom: -24,
    marginRight: 10,
    marginLeft: -10
  }
};
