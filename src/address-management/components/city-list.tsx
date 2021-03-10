import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm, Pagination } from 'antd';
import { IMap } from 'plume2';
import { List } from 'immutable';
import nodataImg from '/web_modules/qmkit/images/sys/no-data.jpg';
type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class CityList extends Component<any, any> {
  _rejectForm;
  state: {};

  props: {
    relaxProps?: {
      loading: boolean;
      cityList: TList;
      getCitysList: Function;
      newCityForm: Function;
      editCityForm: Function;
      deleteCity: Function;
      cityPagination: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    cityList: 'cityList',
    cityPagination: 'cityPagination',
    getCitysList: noop,
    newCityForm: noop,
    editCityForm: noop,
    deleteCity: noop
  };
  componentDidMount() {
    this.getCityList(1, 10);
  }
  getCityList = (currentPage, pageSize) => {
    const { getCitysList } = this.props.relaxProps;
    if (currentPage < 1 || pageSize < 0) {
      return;
    }
    getCitysList({
      pageNum: currentPage - 1,
      pageSize
    });
  };
  editRow = (item) => {
    const { editCityForm } = this.props.relaxProps;
    editCityForm(item);
  };
  deleteRow = (item) => {
    const { deleteCity } = this.props.relaxProps;
    deleteCity({ id: item.id });
  };
  addCity = () => {
    const { newCityForm } = this.props.relaxProps;
    newCityForm();
  };

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const country = item.get('country');
        const state = item.get('state');
        const city = item.get('city');
        const postCode = item.get('postCode');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td style={{ wordBreak: 'break-all' }}>{country}</td>
            <td style={{ wordBreak: 'break-all' }}>{state}</td>
            <td style={{ wordBreak: 'break-all' }}>{city}</td>
            <td style={{ wordBreak: 'break-all' }}>{postCode}</td>
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
              <Popconfirm placement="topLeft" title={<FormattedMessage id="Setting.Areyousuretodelete" />} onConfirm={() => this.deleteRow(item.toJS())} okText={<FormattedMessage id="Setting.Confirm" />} cancelText={<FormattedMessage id="Setting.Cancel" />}>
                <Tooltip placement="top" title="Delete">
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </td>
          </tr>
        );
      })
    );
  }
  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
        </td>
      </tr>
    );
  }
  render() {
    const { loading, cityList, cityPagination } = this.props.relaxProps;
    const pagination = cityPagination.toJS();
    return (
      <div>
        <div>
          <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }} onClick={this.addCity}>
            <FormattedMessage id="Setting.AddCity" />
          </Button>
        </div>
        {cityList ? (
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
                            <FormattedMessage id="Setting.Country" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.State" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.City" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.Postcode" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Setting.Operation" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(cityList)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              {pagination.total > 0 ? (
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={(pageNum, pageSize) => {
                    this.getCityList(pageNum, pageSize);
                  }}
                />
              ) : null}
            </div>
          </div>
        ) : !loading ? (
          <div className="ant-table-placeholder">
            <img src={nodataImg} width="80" className="no-data-img" />
          </div>
        ) : null}
      </div>
    );
  }
}
