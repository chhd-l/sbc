import React from 'react';
import { Table, Alert, Button, Tooltip, message } from 'antd';
import { Const, cache, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getForcastList } from '../webapi';

const defaultImg = require('../img/none.png');

export default class ForcastList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      list: []
    }
  }

  componentDidMount() {
    this.getForecastList();
  }

  getForecastList = () => {
    this.setState({ loading: true });
    getForcastList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          list: (data.res.context?.forecastVOList ?? []).map(item => ({ ...item, futureListArr: (item.futureList || []).map(ft => Object.values(ft)[0]) }))
        });
      } else {
        this.setState({
          loading: false
        })
      }
    });
  }

  handleExport = () => {
    const base64 = new util.Base64();
    const token = (window as any).token;
    if (token) {
      const result = JSON.stringify({
        token: token
      });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref = Const.HOST + `/inventory/forecast/export/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('Please login in');
    }
  };

  render() {
    const { loading, list } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="Product.image" />,
        dataIndex: 'skuImgUrl',
        key: 'skuImgUrl',
        width: 80,
        fixed: true,
        render: (img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)
      },
      {
        title: <FormattedMessage id="Product.productName" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: 150,
        fixed: true,
        align: "left" as "left" | "right" | "center",
        render: (text) => (
          <Tooltip
            overlayStyle={{
              overflowY: 'auto'
            }}
            placement="bottomLeft"
            title={<div>{text}</div>}
          >
            <p style={styles.text}>{text}</p>
          </Tooltip>
        )
      },
      {
        title: <FormattedMessage id="Product.SKU" />,
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: <FormattedMessage id="Product.SPU" />,
        dataIndex: 'spuNo',
        key: 'spuNo'
      },
      {
        title: <FormattedMessage id="Product.marketPrice" />,
        dataIndex: 'marketingPrice',
        key: 'marketingPrice',
        render: (text) => (<p style={styles.lineThrough}>
          {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
          {text == null ? 0.0 : text.toFixed(2)}
        </p>)
      },
      {
        title: <FormattedMessage id="Product.ProductCategory" />,
        dataIndex: 'productCate',
        key: 'productCate'
      },
      {
        title: <FormattedMessage id="Product.Salescategory" />,
        dataIndex: 'salesCate',
        key: 'salesCate'
      },
      {
        title:  <FormattedMessage id="Product.CurrentInventory" />,
        dataIndex: 'inventory',
        key: 'inventory'
      },
      {
        title:  <FormattedMessage id="Product.The1stDay" />,
        dataIndex: 'futureListArr[0]',
        width: 150,
        key: 'f1'
      },
      {
        title:  <FormattedMessage id="Product.The2ndDay" />,
        dataIndex: 'futureListArr[1]',
        width: 150,
        key: 'f2'
      },
      {
        title:  <FormattedMessage id="Product.The3rdDay" />,
        dataIndex: 'futureListArr[2]',
        width: 150,
        key: 'f3'
      },
      {
        title:  <FormattedMessage id="Product.The4thDay" />,
        dataIndex: 'futureListArr[3]',
        width: 150,
        key: 'f4'
      },
      {
        title:  <FormattedMessage id="Product.The5thDay" />,
        dataIndex: 'futureListArr[4]',
        width: 150,
        key: 'f5'
      },
      {
        title:  <FormattedMessage id="Product.The6thDay" />,
        dataIndex: 'futureListArr[5]',
        width: 150,
        key: 'f6'
      },
      {
        title:  <FormattedMessage id="Product.The7thDay" />,
        dataIndex: 'futureListArr[6]',
        width: 150,
        key: 'f7'
      },
      {
        title:  <FormattedMessage id="Product.The8thDay" />,
        dataIndex: 'futureListArr[7]',
        width: 150,
        key: 'f8'
      },
      {
        title:  <FormattedMessage id="Product.The9thDay" />,
        dataIndex: 'futureListArr[8]',
        width: 150,
        key: 'f9'
      },
      {
        title:  <FormattedMessage id="Product.The10thDay" />,
        dataIndex: 'futureListArr[9]',
        width: 150,
        key: 'f10'
      },
      {
        title:  <FormattedMessage id="Product.The11thDay" />,
        dataIndex: 'futureListArr[10]',
        width: 150,
        key: 'f11'
      },
      {
        title:  <FormattedMessage id="Product.The12thDay" />,
        dataIndex: 'futureListArr[11]',
        width: 150,
        key: 'f12'
      },
      {
        title:  <FormattedMessage id="Product.The13thDay" />,
        dataIndex: 'futureListArr[12]',
        width: 150,
        key: 'f13'
      },
      {
        title:  <FormattedMessage id="Product.The14thDay" />,
        dataIndex: 'futureListArr[13]',
        width: 150,
        key: 'f14',
        align: "left" as "left" | "right" | "center"
      }
    ];
    return (
      <div className="table-overflow">
        <Alert message={<FormattedMessage id="Product.SetQuantity" />} type="info" />
        <div className="inventory flex-start-align">
          <Button type="primary" onClick={this.handleExport}>
            <FormattedMessage id="Product.bulkExport" />
          </Button>
        </div>
        <Table
          rowKey="skuId"
          columns={columns}
          dataSource={list}
          loading={loading}
          scroll={{x:true}}
        />
      </div>
    );
  }
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cell: {
    color: '#999',
    width: 180,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  textCon: {
    width: 100,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
