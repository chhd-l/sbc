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
      saveSeo: Function;
      savePage: Function;
      setSeoModalVisible: Function;
    };
  };

  static relaxProps = {
    saveSeo: noop,
    savePage: noop,
    setSeoModalVisible: noop
  };
  editSeo() {
    const { setSeoModalVisible } = this.props.relaxProps;
    setSeoModalVisible(true);
  }
  render() {
    const { saveSeo, savePage, setSeoModalVisible } = this.props.relaxProps;

    const dataSource = [
      {
        key: '1',
        pageName: 'Homepage'
      },
      {
        key: '2',
        pageName: 'Product List Page'
      },
      {
        key: '3',
        pageName: 'Product Detail Page'
      },
      {
        key: '4',
        pageName: 'Search Page'
      },
      {
        key: '5',
        pageName: 'Checkout Page'
      },
      {
        key: '6',
        pageName: 'Payment Page'
      },
      {
        key: '7',
        pageName: 'Subscription page'
      },
      {
        key: '8',
        pageName: 'Help us page'
      }
    ];

    const columns = [
      {
        title: 'Page',
        dataIndex: 'pageName',
        key: 'pageName'
      },
      {
        title: 'Operation',
        dataIndex: 'Operation',
        key: 'Operation',
        render: () => <a href="javascript:void(0);" style={{ marginRight: 5 }} onClick={() => this.editSeo()} className="iconfont iconicon"></a>
      }
    ];
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} />
        <SeoModal />
      </div>
    );
  }
}
