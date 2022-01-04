import React from 'react';
import { Table, Alert, Button, Tooltip, message, DatePicker } from 'antd';
import { Const, cache, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getForcastList, exportForcastList } from '../webapi';
import moment from 'moment';

const defaultImg = require('../img/none.png');
const { RangePicker } = DatePicker;

export default class ForcastList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      startDate: null,
      endDate: null,
      list: [],
      columns: []
    };
  }

  componentDidMount() {
    this.getForecastList();
  }

  getForecastList = () => {
    this.setState({ loading: true });
    const origialColumns = [
      {
        title: <FormattedMessage id="Product.image" />,
        dataIndex: 'skuImgUrl',
        key: 'skuImgUrl',
        width: 80,
        fixed: true,
        render: (img) =>
          img ? (
            <img src={img} style={styles.imgItem} />
          ) : (
            <img src={defaultImg} style={styles.imgItem} />
          )
      },
      {
        title: <FormattedMessage id="Product.productName" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: 150,
        fixed: true,
        align: 'left' as 'left' | 'right' | 'center',
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
        render: (text) => (
          <p style={styles.lineThrough}>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {text == null ? 0.0 : text.toFixed(2)}
          </p>
        )
      },
      {
        title: <FormattedMessage id="product.subscriptionPrice" />,
        dataIndex: 'subscriptionPrice',
        key: 'subscriptionPrice',
        render: (text) => (
          <p style={styles.lineThrough}>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {text == null ? 0.0 : text.toFixed(2)}
          </p>
        )
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
        title: <FormattedMessage id="Product.AvgDailySales" />,
        dataIndex: 'avgDailySales',
        key: 'avgDailySales',
        render: (text) =>
          text === 'Not sold in the last 30 days' ? (
            text
          ) : (
            <p style={styles.lineThrough}>
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
              {text}
            </p>
          )
      },
      {
        title: <FormattedMessage id="Product.stockCoverageInDays" />,
        dataIndex: 'stockCoverageInDays',
        key: 'stockCoverageInDays'
      },
      {
        title: <FormattedMessage id="Product.CurrentInventory" />,
        dataIndex: 'inventory',
        key: 'inventory'
      }
    ];
    const { startDate, endDate } = this.state;
    getForcastList(startDate && endDate ? { startDate, endDate } : {}).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        let dataList = (data.res.context?.forecastVOList ?? []).map((item) => ({
          ...item,
          futureListArr: (item.futureList || []).map((ft) => Object.values(ft)[0])
        }));
        let dymicColumns = dataList[0].futureList.map((item, index) => {
          return {
            title: Object.keys(item)[0],
            dataIndex: `futureListArr[${index}]`,
            width: 100,
            key: 'f' + index
          };
        });
        this.setState({
          loading: false,
          list: dataList,
          columns: [...origialColumns, ...dymicColumns]
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };

  handleExport = () => {
    const base64 = new util.Base64();
    const { startDate, endDate } = this.state;
    const token = (window as any).token;
    if (token) {
      const result = JSON.stringify({
        token: token,
        startDate,
        endDate
      });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      exportForcastList(encrypted)
        .then((data) => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(data.res.message);
          } else {
            message.error(data.res.message);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    } else {
      message.error('Please login in');
    }
  };

  dateTimeChange = (date, dateString) => {
    this.setState({
      startDate: date[0] ? date[0].format('YYYY-MM-DD') : null,
      endDate: date[1] ? date[1].format('YYYY-MM-DD') : null
    });
  };

  disabledDate = (current) => {
    return current && (current < moment().endOf('day') || current > moment().day(16).endOf('day'));
  };

  render() {
    const { loading, list, columns } = this.state;

    return (
      <div className="table-overflow">
        <Alert message={<FormattedMessage id="Product.SetQuantity" />} type="info" />
        <div className="flex-start-align" style={{ marginBottom: 20 }}>
          <RangePicker
            allowClear
            disabledDate={this.disabledDate}
            style={{ marginRight: 10 }}
            onChange={this.dateTimeChange}
          />
          <Button type="primary" onClick={this.getForecastList} style={{ marginRight: 10 }}>
            <FormattedMessage id="Public.Search" />
          </Button>
          <Button type="primary" onClick={this.handleExport}>
            <FormattedMessage id="Product.bulkExport" />
          </Button>
        </div>
        <Table
          rowKey="skuId"
          columns={columns}
          dataSource={list}
          pagination={{ pageSize: 5 }}
          loading={loading}
          scroll={{ x: true }}
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
