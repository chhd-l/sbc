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
  render() {
    const { loading, allPages, saveSeo, savePage, setSeoModalVisible } = this.props.relaxProps;
    const dataSource = allPages.toJS();
    const columns = [
      {
        title: 'Page',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Operation',
        dataIndex: 'Operation',
        key: 'Operation',
        render: (text, record) => <a href="javascript:void(0);" style={{ marginRight: 5 }} onClick={() => this.editSeo(text, record)} className="iconfont iconicon"></a>
      }
    ];
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} loading={loading} />
        <SeoModal />
      </div>
    );
  }
}
