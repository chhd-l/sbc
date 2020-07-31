import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { cache, noop } from 'qmkit';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Checkbox,
  Pagination,
  Spin,
  Tooltip
} from 'antd';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { AuthWrapper, Const } from 'qmkit';
import momnet from 'moment';
import Moment from 'moment';
const FormItem = Form.Item;
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
    const {
      setModalVisible,
      getBannerById,
      onImageFormChange
    } = this.props.relaxProps;
    onImageFormChange({ field: 'bannerId', value: null });
    await getBannerById({ bannerId: bannerId, storeId: this.state.storeId });
    this.props.editStatusChange('edit');
    setModalVisible(true);
  }
  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={10}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const id = item.get('id');
        const pcName = item.get('bannerName');
        const bannerNo = item.get('bannerNo');
        const webSkipUrl = item.get('webSkipUrl');
        const mobiSkipUrl = item.get('mobiSkipUrl');
        // const mobileName = item.get('mobileName');
        const pcImage = item.get('webUrl');
        const mobileImage = item.get('mobiUrl');
        let pcType, mobileType;
        if (
          pcImage.endsWith('.jpg') ||
          pcImage.endsWith('.jpeg') ||
          pcImage.endsWith('.png') ||
          pcImage.endsWith('.gif')
        ) {
          pcType = 'image';
        } else {
          pcType = 'video';
        }
        if (
          mobileImage.endsWith('.jpg') ||
          mobileImage.endsWith('.jpeg') ||
          mobileImage.endsWith('.png') ||
          mobileImage.endsWith('.gif')
        ) {
          mobileType = 'image';
        } else {
          mobileType = 'video';
        }

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td>{bannerNo}</td>
            <td>{pcName}</td>
            <td className="pad0">
              {pcType === 'image' ? (
                <div className="img-box ">
                  <img className="img" src={pcImage} />
                </div>
              ) : (
                <div>
                  <video width="220" height="260" controls>
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
                <video width="220" height="260" controls>
                  <source src={mobileImage} type="video/mp4" />
                </video>
              )}
            </td>
            <td>{webSkipUrl}</td>
            <td>{mobiSkipUrl}</td>
            <td>
              <span className="red" onClick={() => this.deleteRow(item.toJS())}>
                <FormattedMessage id="delete" />
              </span>
              <span
                className="red mgl20"
                onClick={() => this.editRow(item.toJS())}
              >
                <FormattedMessage id="edit" />
              </span>
            </td>
          </tr>
        );
      })
    );
  }

  render() {
    const {
      loading,
      tableDatas,
      setModalVisible,
      onImageFormChange,
      resetForm
    } = this.props.relaxProps;
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
              this.props.editStatusChange('new');
              setModalVisible(true);
            }}
          >
            <FormattedMessage id="upload" />
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
                          <th>
                            <FormattedMessage id="bannerNo" />
                          </th>
                          <th>
                            <FormattedMessage id="resourceName" />
                          </th>
                          <th>
                            <FormattedMessage
                              id="resource"
                              values={{ type: 'Pc' }}
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="resourceName"
                              values={{ type: 'Mobile' }}
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="bannerUrl"
                              values={{ type: 'Pc' }}
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="bannerUrl"
                              values={{ type: 'Mobile' }}
                            />
                          </th>
                          <th>
                            <FormattedMessage id="operator" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {loading
                          ? this._renderLoading()
                          : this._renderContent(tableDatas)}
                      </tbody>
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
              No data
            </span>
          </div>
        )}
      </div>
    );
  }
}
