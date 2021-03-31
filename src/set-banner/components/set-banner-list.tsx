import React, { Component } from 'react';
import { Relax } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm } from 'antd';
import { IMap } from 'plume2';
import { List } from 'immutable';

type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class SetBannerList extends Component<any, any> {
  _rejectForm;
  state: {
    storeId: 0;
  };

  props: {
    relaxProps?: {
      loading: boolean;
      tableDatas: TList;
      setModalVisible: Function;
      deleteRow: Function;
      getList: Function;
      getBannerById: Function;
      getStoreId: Function;
      onImageFormChange: Function;
      resetForm: Funciton;
      setIsEdit: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    tableDatas: 'tableDatas',
    setModalVisible: noop,
    deleteRow: noop,
    getList: noop,
    getStoreId: noop,
    getBannerById: noop,
    onImageFormChange: noop,
    resetForm: noop,
    setIsEdit: noop
  };
  handleTableChange() {}
  componentDidMount() {
    const { getList, getStoreId } = this.props.relaxProps;
    const storeId = getStoreId();
    this.setState({
      storeId
    });
    getList({ storeId: storeId });
  }
  deleteRow({ bannerId }) {
    const { deleteRow } = this.props.relaxProps;
    deleteRow({ bannerId: bannerId });
  }
  async editRow({ bannerId }) {
    const { setModalVisible, getBannerById, onImageFormChange } = this.props.relaxProps;
    onImageFormChange({ field: 'bannerId', value: null });
    await getBannerById({ bannerId: bannerId, storeId: this.state.storeId });
    setModalVisible(true);
  }
  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={10}>
          <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const pcName = item.get('bannerName');
        const bannerNo = item.get('bannerNo');
        const webSkipUrl = item.get('webSkipUrl');
        const mobiSkipUrl = item.get('mobiSkipUrl');
        // const mobileName = item.get('mobileName');
        const pcImage = item.get('webUrl');
        const mobileImage = item.get('mobiUrl');
        let pcType = 'image';
        let mobileType = 'image';
        if (pcImage.endsWith('.jpg') || pcImage.endsWith('.jpeg') || pcImage.endsWith('.png') || pcImage.endsWith('.gif')) {
          pcType = 'image';
        } else {
          pcType = 'video';
        }
        if (mobileImage.endsWith('.jpg') || mobileImage.endsWith('.jpeg') || mobileImage.endsWith('.png') || mobileImage.endsWith('.gif')) {
          mobileType = 'image';
        } else {
          mobileType = 'video';
        }

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td style={{ wordBreak: 'break-all' }}>{bannerNo}</td>
            <td style={{ wordBreak: 'break-all' }}>{pcName}</td>
            <td className="pad0">
              {pcType === 'image' ? (
                <div className="img-box ">
                  <img className="img" src={pcImage} />
                </div>
              ) : (
                <div>
                  <video width="220" height="240" controls>
                    <source src={pcImage} type="video/mp4" />
                  </video>
                </div>
              )}
            </td>
            {/*<td>{mobileName}</td>*/}
            <td className="pad0">
              {mobileType === 'image' ? (
                <div className="img-box">
                  <img className="img" src={mobileImage} />
                </div>
              ) : (
                <video width="220" height="240" controls>
                  <source src={mobileImage} type="video/mp4" />
                </video>
              )}
            </td>
            <td style={{ wordBreak: 'break-all' }}>{webSkipUrl}</td>
            <td style={{ wordBreak: 'break-all' }}>{mobiSkipUrl}</td>
            <td>
              <Tooltip placement="top" title={<FormattedMessage id="Setting.Edit" />}>
                <span
                  /*className="red mgl20"*/
                  style={{ color: 'red', paddingRight: 10, cursor: 'pointer' }}
                  onClick={() => this.editRow(item.toJS())}
                  className="iconfont iconEdit"
                >
                  {/*<FormattedMessage id="edit" />*/}
                </span>
              </Tooltip>
              <Popconfirm placement="topLeft" title={<FormattedMessage id="Setting.deleteThisItem" />} onConfirm={() => this.deleteRow(item.toJS())} okText={<FormattedMessage id="Setting.Confirm" />} cancelText={<FormattedMessage id="Setting.Cancel" />}>
                <Tooltip placement="top" title={<FormattedMessage id="Setting.Delete" />}>
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </td>
          </tr>
        );
      })
    );
  }

  render() {
    const { loading, tableDatas, setModalVisible, resetForm } = this.props.relaxProps;
    return (
      <div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginBottom: '10px' }}
            onClick={(e) => {
              e.stopPropagation();
              resetForm();
              setModalVisible(true);
            }}
          >
            <FormattedMessage id="Setting.Upload" />
          </Button>
        </div>
        {tableDatas.size > 0 ? (
          <div>
            <div className="ant-table-wrapper">
              <div className="ant-table ant-table-large ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-body">
                    <table
                      style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0 1em'
                      }}
                    >
                      <thead className="ant-table-thead">
                        <tr>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="bannerNo" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.ResourceName" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.resource" values={{ type: 'Pc' }} />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.resourceName" values={{ type: 'Mobile' }} />
                          </th>
                          <th style={{ width: '25%' }}>
                            <FormattedMessage id="Setting.bannerUrl" values={{ type: 'Pc' }} />
                          </th>
                          <th style={{ width: '25%' }}>
                            <FormattedMessage id="Setting.bannerUrl" values={{ type: 'Mobile' }} />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.Operator" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(tableDatas)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ant-table-placeholder">
            <span>
              <i className="anticon anticon-frown-o" />
              <FormattedMessage id="Setting.NoData" />
            </span>
          </div>
        )}
      </div>
    );
  }
}
