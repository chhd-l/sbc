import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Table } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import SeoModal from './seo-modal';

@Relax
export default class PageSeo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: any;
      allPages: any;
      pageNum: any;
      total: any;
      saveSeo: Function;
      savePage: Function;
      setSeoModalVisible: Function;
      getSeo: Function;
      changeCurrentPage: Function;
      getPages: Function;
    };
  };

  static relaxProps = {
    allPages: 'allPages',
    loading: 'loading',
    pageNum: 'pageNum',
    total: 'total',
    saveSeo: noop,
    savePage: noop,
    setSeoModalVisible: noop,
    getSeo: noop,
    changeCurrentPage: noop,
    getPages: noop
  };
  componentDidMount() {
    // const { getPages } = this.props.relaxProps;
    // getPages()
  }
  _handelOk() {}
  editSeo(text, record) {
    const { setSeoModalVisible, getSeo, changeCurrentPage } = this.props.relaxProps;
    getSeo(3, record.name);
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { getPages } = this.props.relaxProps;
    getPages(pagination.current - 1);
  };
  render() {
    const { loading, allPages, pageNum, total, saveSeo, savePage, setSeoModalVisible } = this.props.relaxProps;
    const dataSource = allPages.toJS();
    const columns = [
      {
        title: <FormattedMessage id="Setting.Page" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="Setting.Operation" />,
        dataIndex: 'Operation',
        key: 'Operation',
        render: (text, record) => <a style={{ marginRight: 5 }} onClick={() => this.editSeo(text, record)} className="iconfont iconicon"></a>
      }
    ];

    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            pageSize: 10,
            current: pageNum,
            total: total
          }}
          onChange={this.handleTableChange}
          loading={{ spinning: loading, delay: 3000, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" /> }}
        />
        <SeoModal />
      </div>
    );
  }
}
