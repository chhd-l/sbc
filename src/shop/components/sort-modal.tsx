import * as React from 'react';
import { Relax } from 'plume2';
import { Modal, Row, Col, Tree, Icon, Tooltip, message } from 'antd';

import styled from 'styled-components';
import { noop, DataGrid, QMUpload, Const, RCi18n } from 'qmkit';
import { IList } from 'typings/globalType';

const TreeNode = Tree.TreeNode;
import { Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

const Column = Table.Column;
const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
  strong {
    color: #666666;
  }
`;
const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const TreeBox = styled.div`
  height: 468px;
  overflow-y: auto;
`;

@Relax
class SortModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      allCates: IList;
      cates: IList;
      sortsVisible: boolean;
      cateSize: number;
      sortModalLoading: boolean;

      sortModal: Function;
      addCate: Function;
      delCate: Function;
      changeRate: Function;
      changeImg: Function;
      save: Function;
    };
    intl: any;
  };

  static relaxProps = {
    // 全部分类
    allCates: 'allCates',
    // 签约分类
    cates: 'cates',
    // 弹框是否显示
    sortsVisible: 'sortsVisible',
    // 签约数量
    cateSize: 'cateSize',
    // 签约分类弹框loading
    sortModalLoading: 'sortModalLoading',

    // 关闭弹框
    sortModal: noop,
    // 新增分类
    addCate: noop,
    // 删除分类
    delCate: noop,
    // 修改扣率
    changeRate: noop,
    // 修改图片
    changeImg: noop,
    // 保存
    save: noop
  };

  render() {
    const { sortsVisible, cateSize, cates, allCates, delCate, sortModalLoading } = this.props.relaxProps;
    // 选中的品台分类
    const chooseIds = cates
      .toJS()
      .map((c) => c.cateId.toString())
      .filter((f) => f);
    if (!sortsVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            <FormattedMessage id="Setting.EditContractCategory" />
            <GreyText>
              <FormattedMessage id="Setting.leaseselect" /> <strong>{cateSize}</strong> <FormattedMessage id="Setting.categoriesCansignup" />
              <strong>200</strong> <FormattedMessage id="Setting.categories" />
            </GreyText>
          </div>
        }
        visible={sortsVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOk}
        confirmLoading={sortModalLoading}
        width={980}
      >
        <Row>
          <Col span={6}>
            <TreeBox>
              <Tree showLine checkable defaultCheckedKeys={chooseIds} checkedKeys={chooseIds} onCheck={this._handleCheck}>
                {this._loop(allCates.toJS())}
              </Tree>
            </TreeBox>
          </Col>
          <Col span={18}>
            <TableBox>
              <DataGrid dataSource={cates.toJS()} scroll={{ y: 400 }} pagination={false} rowKey={(record) => record.cateId}>
                <Column title={(window as any).RCi18n({ id: 'Setting.Category' })} dataIndex="cateName" key="cateName" width="12%" />
                <Column title={(window as any).RCi18n({ id: 'Setting.SuperiorCategory' })} dataIndex="parentGoodCateNames" key="parentGoodCateNames" width="20%" />
                <Column title={(window as any).RCi18n({ id: 'Setting.CategoryDeductionRate' })} dataIndex="cateRate" key="cateRate" width="20%" render={(text, record: any) => (text ? text : record.platformCateRate ? record.platformCateRate : 0) + '%'} />
                <Column
                  title={
                    <div>
                      <p>
                        Business Qualification&nbsp;
                        <Tooltip title={(window as any).RCi18n({ id: 'Setting.Supportjpg' })}>
                          <Icon style={{ color: '#F56C1D' }} type="question-circle-o" />
                        </Tooltip>
                      </p>
                      <GreyText>
                        <FormattedMessage id="Setting.Signbusinesslicenses" />
                      </GreyText>
                    </div>
                  }
                  dataIndex="qualificationPics"
                  key="qualificationPics"
                  width="30%"
                  render={(text, record: any) => {
                    return (
                      <QMUpload
                        beforeUpload={this._checkUploadFile}
                        name="uploadFile"
                        style={styles.box}
                        fileList={text ? JSON.parse(text) : []}
                        action={Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'}
                        listType="picture-card"
                        accept={'.jpg,.jpeg,.png,.gif'}
                        onChange={(info) => this._editImages(info, record.cateId)}
                      >
                        {(text ? JSON.parse(text) : []).length < 10 && <Icon type="plus" style={styles.plus} />}
                      </QMUpload>
                    );
                  }}
                />
                <Column
                  title={(window as any).RCi18n({ id: 'Setting.Operating' })}
                  dataIndex="operation"
                  key="operation"
                  width="13%"
                  render={(_text, record: any) => (
                    <a href="#" onClick={() => delCate(record.cateId)}>
                      <FormattedMessage id="Setting.Delete" />
                    </a>
                  )}
                />
              </DataGrid>
            </TableBox>
          </Col>
        </Row>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * 分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
   */
  _loop = (cateList) =>
    cateList.map((item) => {
      const childCates = item.goodsCateList;
      if (childCates && childCates.length) {
        return (
          <TreeNode disableCheckbox={item.cateGrade != 3} key={item.cateId.toString()} value={item.cateId.toString()} title={item.cateName.toString() + ' ' + `${item.cateRate ? item.cateRate.toString() + '%' : ''}`}>
            {this._loop(childCates)}
          </TreeNode>
        );
      }
      return <TreeNode disableCheckbox={item.cateGrade != 3} key={item.cateId.toString()} value={item.cateId.toString()} title={item.cateName.toString() + ' ' + `${item.cateRate ? item.cateRate.toString() + '%' : ''}`} />;
    });

  /**
   * 选中/取消 分类
   */
  _handleCheck = (_checkedKeys, e) => {
    const { addCate, delCate } = this.props.relaxProps;
    // 选中, 进行新增
    if (e.checked) {
      addCate(e.node.props.value);
    } else {
      // 反选, 进行删除
      delCate(e.node.props.value);
    }
  };

  /**
   * 保存
   */
  _handleOk = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.save();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = (info, cateId) => {
    const { file, fileList } = info;
    if (fileList.length > 10) {
      message.error((window as any).RCi18n({ id: 'Setting.Youcanonlyupload' }));
      return;
    }
    const { changeImg } = this.props.relaxProps;
    if (file.status == 'removed' || fileList.length == 0 || (fileList.length > 0 && this._checkUploadFile(file))) {
      const status = file.status;
      if (status === 'done') {
        message.success(`${file.name} ${(window as any).RCi18n({ id: 'Setting.Uploadedsuccessfully' })}!`);
      } else if (status === 'error') {
        message.error(`${file.name} ${(window as any).RCi18n({ id: 'Setting.Uploadedfailed' })}!`);
      }
      changeImg({ cateId, imgs: JSON.stringify(fileList) });
    }
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= Const.fileSize.TWO) {
        return true;
      } else {
        message.error((window as any).RCi18n({ id: 'Setting.Filesizecannotexceed2M' }));
        return false;
      }
    } else {
      message.error((window as any).RCi18n({ id: 'Setting.Fileformaterror' }));
      return false;
    }
  };
}

export default injectIntl(SortModal);

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
