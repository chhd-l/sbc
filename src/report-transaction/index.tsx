import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const, util, AuthWrapper, cache } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CountUp from 'react-countup';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const icon1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAD50lEQVRYCcVYMW8dRRCemV2fsRNQkBwUp0iCRAUFSgAJCiQkIBFOQDRQ8QcQHR0VLiiiSBSRCFUEBSKWiJSCEEcBOoTcABFCVFShSBoLmYBf/O7d7jDfhb3cO9+99yzb8pOs3Zmdme+7udndOTNt4ffW719lvTC7Ly+yGY19P63s86Aucxz6rAXLdJH5/N6s661ffurtfNLQPM5QVfnVn79/JJP8wCCP2Tj7tD5lDma+9t0zr9xlZk36tnEkiZO/3tjnQzG3FfAmCMgUzq9++/Sp9eZakltJ4OkXfrg+V2ThQDLc7uhzt7b84murbVnZRGJRVX5a+Wa+LzS7XeCm/3Sk3rMvnLmzyBzra1IXkIHdIgAcPBjiA6eOO0QCr2A3MlAHRHzg1HUVIxSh3ssP1xc3zUN8XSke26RvUzD3if0N2xi3WpdnstupWD0MkJ7TN5fnBm3WSQcCGj9O4thRbVdK8U7k7GWhsCk0dp3h9lCo5evAObCdbdhJKOohKcKxtnXgARdrZSbKg6jNsq5zcpWDZW2S16F0xlwfv+8e7BW7P+qh0hy4Nv/b4yhe+2fCkxBEaKiWU7xy1EjPeeZ/BzGfZ+WSRBSd7/JANoDvcRfg+bbzsxNRXN4/a8X1ZmGBhN2SZawMaW98flRs4NuZms2MMhq3ZjXtjcB5EEi2kflumhPFkTsO+ILb8IHD1mby0FRGWnxqBE4lT2ZZcqwrD2QemQngC67j5LCVUZhmw/rGRYr6UuXH9Bk5+dDOh9uVLtJIEsAX9AOVw4QT8fRwKIrPLQPPJxclvsDOny3l4O9UetZDkY1yxw/4goakY71VLbF4tNgovrBaPp4MmOmceHc+yWpFYvO/SllpKsbiYFprjsAXdETNhS7ZHuhgiPylPdaTpQ2aFZZFcv5i08cWqmwId+8Q4Nv69GQkoh6O+WDJtvMTADQiwf4+YCeXmgQgC3NVF6zaWRfAF/SEbUHqOtuGRykGI0BHSj3TIDr/Pjl3pW43NGeaiATwBU3pkHNDUOf22/1zyY6z+0+j1Hfi37NSu94wHRaVfqsUSqvVvDEBflm1C79cO9p5gcVwUqN+Al+78XrWjrzL4lYasdrFEN+wBbVte7XNAP3n8onTt8ozAl0x08ZjbYbkp36kQb7CxPtV5CMjcrPVrk3p5Os2ddIBF/MyE//3E0c6s5G8dnBEFq4dX/iz6icwQVu+gxhjQwEPuDCsblm0WmjLx3rvgAFwUms3RAICvgvQlu8ATmcIxAdO3aDKBJRID74LdosI4iJ+eg2JSFmYSUgjCnVPv8ASEYx7+i1aJ4Ks7OlXeZ0M5rv1/4n/ANnU1qrBziWWAAAAAElFTkSuQmCC';
const icon2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAEEklEQVRYCcVYO2wcRRie167vkVzsJA62Y4STQGUFYUBIESIFCBBIgECiMKEBuUIIpQqUpkoT6KgRdYQoaHgICUFDgTBCCkg4ds7GvgTFUiI/7rE7O5P51vznvfWuLxds55p//sf837fz7878c5z18Lsy/qZ/XNTLqyooqsCqUDAldCCN8iPPMK19rivabyyb0sb4lcvB3abm3QKttXz+yecrRWP6o6b2u8WTXxZU0BDi9slfv1/lnFuyZ8kdSdx49IWykfpoL+BpEJARkVoZ+uO7jbSP9EwSePqrj589Wmjyfgr8v7JZsLcf/u2nlaxVEenkdnpaLD323MhuEgAG8iEv8qcxO1YCK4BAFuhSOnDXdF/VR3//oZZckQ5WKMGeEsCTuAeMcRJP1SaBl3C3S5DA6RgCB3hkjEmgDPgKyLgfEnjABVZMAvtA3mfY12iUzez8F3Z27kteq03sFkHgAbdNAhtRXvJw5dbTzJgz1tjTZq3+OV9ePpMXm7bz6j+v8urSK2k76YQrsRX74doRcqSl78l/o9W1N5wdNfRsEL2smo2/bKVSTccmdRCIWq1LNtIvivV6lfVX/k76MbbayKkHnloXOAvSzqTeKpXW5eCht1zlrm/abV+40fzMVBdfSsalxybSp8lmbP77BnyBw4iC86Q5PLggjg1McsYXN2Osx1vBp44IVij7Z8wIObjy/nsAsmxJ4AuchlumHUYDAzU5NDjJGL+KKHciSUfkIru26FZp+88yu0VCqlwSwBc4jrenyLaYQ5WbYmT4HBPiT0Q4ItwEwTSbX5zaNsOwYbJF5WIuibgdQD9AwXclD5ZuFY8Pve2IzFC8CYMLdn7hA9JtUO9z48ObOg9l5cBN8qUl8AUakrSjmx6/rA+OvMOF+IVibRi+b+cWPoIu1zbaq+B2oxuWi9x+AvgCHREl6kXaQqHujQ1POSI/0jyrw3fZ3LWPdSPYeh8Ezy0F5gFfoCWjJL1K7RUDdWL0PSvENzTX6GiSB2F7QzNdSABfoCekBPciI+Vr79RD54WSX9F8bmy8HUPnXNTIniWBL9CUZjl7sRkhDTt14kNxoHxOVQ6+Zjj3aL7htMmRpVMCX6Errk08G+QdYMkpOAciE40lbemxgUGbJ8guPZn7TqD/HJ+5HMR7BLpi10Yfo4lZMibQan6S5dvRprzccgAXc+OjHG05WO2Y7B6c+DzVkeyDDnjARdp4JdDvuU5nJWK6/WmlMe3Y6NeyusS6lYPmOQIt2V/6Vnt9IdmSEtcA6jPjzoacsxPPDO5Hi4f2/5GZn9u7aFwOIoF7AXPdMOl7Il3+GCeRvIMElmf09bPX94wI2n2Xn8pAPDrKQcb9voFlkiAy9/UuSiQgsSr39VaeJIPxXv0/cQeTu+OSeUihNAAAAABJRU5ErkJggg==';

const countUpProps = {
  start: 0,
  duration: 1.5,
  useEasing: false,
  useGrouping: true,
  separator: ','
};

export default class TransactionReport extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Transaction',
      loading: true,
      overviewList: [],
      subscriptionList: [],
      tableData: [],
      startDate: '',
      endDate: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      currentTrend: 'Week trend',

      xData_week: [],
      averageBasketData_week: [],
      consumersData_week: [],
      revenueData_week: [],
      salesVolumeData_week: [],

      xData_day: [],
      averageBasketData_day: [],
      consumersData_day: [],
      revenueData_day: [],
      salesVolumeData_day: []
    };
  }
  componentDidMount = () => {
    this.getDefaultDate();
    this.transactionTrend();
    this.transactionTrendDay();
  };

  chartInit = () => {
    const {
      currentTrend,
      xData_week,
      averageBasketData_week,
      consumersData_week,
      revenueData_week,
      salesVolumeData_week,

      xData_day,
      averageBasketData_day,
      consumersData_day,
      revenueData_day,
      salesVolumeData_day
    } = this.state;
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.30)'
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)'
          }
        },
        data: currentTrend === 'Week trend' ? xData_week : xData_day
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.45)'
            }
          }
        },
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.45)'
            }
          }
        }
      ],
      legend: {
        data: ['Sales volume', 'Revenue', 'Consumers', 'Average basket'],
        top: 20
      },

      series: [
        {
          name: 'Sales volume',
          type: 'line',
          lineStyle: {
            color: '#E1021A'
          },
          itemStyle: {
            color: '#E1021A'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#E1021A',
              borderWidth: 2
            }
          },
          yAxisIndex: 1,
          data: currentTrend === 'Week trend' ? salesVolumeData_week : salesVolumeData_day
        },
        {
          name: 'Revenue',
          type: 'line',
          lineStyle: {
            color: '#15B1AB'
          },
          itemStyle: {
            color: '#15B1AB'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#15B1AB',
              borderWidth: 2
            }
          },
          data: currentTrend === 'Week trend' ? revenueData_week : revenueData_day
        },
        {
          name: 'Consumers',
          type: 'line',
          lineStyle: {
            color: '#F8D46E'
          },
          itemStyle: {
            color: '#F8D46E'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#F8D46E',
              borderWidth: 2
            }
          },
          yAxisIndex: 1,
          data: currentTrend === 'Week trend' ? consumersData_week : consumersData_day
        },
        {
          name: 'Average basket',
          type: 'line',
          lineStyle: {
            color: '#4D98D3'
          },
          itemStyle: {
            color: '#4D98D3'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#4D98D3',
              borderWidth: 2
            }
          },
          data: currentTrend === 'Week trend' ? averageBasketData_week : averageBasketData_day
        }
      ]
    });
  };

  handleChange = (value) => {
    this.setState(
      {
        currentTrend: value
      },
      () => this.chartInit()
    );
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.transactionReportPage()
    );
  };
  dateCalculate = (n) => {
    let date = new Date(sessionStorage.getItem('defaultLocalDateTime'));
    return date.setDate(date.getDate() - n);
  };
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }

  onChangeDate = (date, dateString) => {
    let startDate = moment(dateString[0]).format('YYYY-MM-DD');
    let endDate = moment(dateString[1]).format('YYYY-MM-DD');
    this.setState(
      {
        startDate,
        endDate
      },
      () => {
        this.transactionStatistics();
        this.transactionReportPage();
      }
    );
  };
  getDefaultDate = () => {
    let startDate = moment(new Date(this.dateCalculate(7)).toLocaleDateString()).format('YYYY-MM-DD');
    let endDate = moment(new Date(this.dateCalculate(0)).toLocaleDateString()).format('YYYY-MM-DD');
    this.setState(
      {
        startDate,
        endDate
      },
      () => {
        this.transactionStatistics();
        this.transactionReportPage();
      }
    );
  };

  transactionStatistics = () => {
    const { startDate, endDate } = this.state;
    let params = {
      beginDate: startDate,
      endDate: endDate
    };
    webapi.transactionStatistics(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let context = res.context;
        let overviewList = [
          {
            name: 'Revenue',
            value: context.revenue,
            rate: context.revenueQoQ
          },
          {
            name: 'Conversion',
            value: context.conversion,
            rate: context.conversionQoQ
          },
          {
            name: 'Units sold',
            value: context.unitsSold,
            rate: context.unitsSoldQoQ
          },
          {
            name: 'Sales volume',
            value: context.salesVolume,
            rate: context.salesVolumeQoQ
          },
          {
            name: 'Average basket',
            value: context.averageBasket,
            rate: context.averageBasketQoQ
          },
          {
            name: 'Sales per visitor',
            value: context.salesPerVisitor,
            rate: context.salesPerVisitorQoQ
          }
        ];
        let subscriptionList = [
          {
            name: 'Subscription rate',
            value: context.subscriptionRate,
            rate: context.subscriptionRateQoQ
          },
          {
            name: 'Subscription number',
            value: context.subscriptionNumber,
            rate: context.subscriptionNumberQoQ
          },
          {
            name: 'Subscription transaction amount',
            value: context.subscriptionAmount,
            rate: context.subscriptionAmountQoQ
          }
          // {
          //   name: 'Average subscription length',
          //   value: context.averageSubscriptionLength,
          //   rate: context.averageSubscriptionLengthQoQ
          // }
        ];
        this.setState({
          overviewList,
          subscriptionList
        });
      }
    });
  };
  transactionTrend = () => {
    webapi.transactionTrend().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let context = res.context;
        let xData_week = [];
        let averageBasketData_week = [];
        let consumersData_week = [];
        let revenueData_week = [];
        let salesVolumeData_week = [];
        for (let i = 0; i < context.length; i++) {
          xData_week.unshift('week-' + context[i].weekNum);
          averageBasketData_week.unshift(context[i].averageBasket);
          consumersData_week.unshift(context[i].consumers);
          revenueData_week.unshift(context[i].revenue);
          salesVolumeData_week.unshift(context[i].salesVolume);
        }
        this.setState(
          {
            xData_week,
            averageBasketData_week,
            consumersData_week,
            revenueData_week,
            salesVolumeData_week,
            loading: false
          },
          () => {
            this.chartInit();
          }
        );
      }
    });
  };
  transactionTrendDay = () => {
    webapi.transactionTrendDay().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let context = res.context;
        let xData_day = [];
        let averageBasketData_day = [];
        let consumersData_day = [];
        let revenueData_day = [];
        let salesVolumeData_day = [];
        for (let i = 0; i < context.length; i++) {
          xData_day.unshift(context[i].date);
          averageBasketData_day.unshift(context[i].averageBasket);
          consumersData_day.unshift(context[i].consumers);
          revenueData_day.unshift(context[i].revenue);
          salesVolumeData_day.unshift(context[i].salesVolume);
        }
        this.setState({
          xData_day,
          averageBasketData_day,
          consumersData_day,
          revenueData_day,
          salesVolumeData_day,
          loading: false
        });
      }
    });
  };
  transactionReportPage = () => {
    const { startDate, endDate, pagination } = this.state;
    let params = {
      beginDate: startDate,
      endDate: endDate,
      pageSize: pagination.pageSize,
      pageNum: pagination.current
    };
    webapi.transactionReportPage(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        pagination.total = res.context.totalElements;
        let tableData = res.context.transactionReport;
        this.setState({
          pagination,
          tableData,
          loading: false
        });
      }
    });
  };
  onExport = () => {
    const { startDate, endDate, pagination } = this.state;
    let params = {
      beginDate: startDate,
      endDate: endDate,
      pageSize: pagination.pageSize,
      pageNum: pagination.current
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/digitalStrategy/transactionReportPage/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('Unsuccessful');
        }

        resolve();
      }, 500);
    });
  };

  render() {
    const { title, overviewList, subscriptionList, tableData, pagination } = this.state;

    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: 'Sales volume',
        dataIndex: 'salesVolume',
        key: 'salesVolume'
      },
      {
        title: 'Revenue',
        dataIndex: 'revenue',
        key: 'revenue',
        render: (revenue) => <span>{revenue != null ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + ' ' + revenue.toFixed(2) : null}</span>
      },
      {
        title: 'Average basket',
        dataIndex: 'averageBasket',
        key: 'averageBasket',
        render: (averageBasket) => <span>{averageBasket != null ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + ' ' + averageBasket.toFixed(2) : null}</span>
      },
      {
        title: 'Units sold',
        dataIndex: 'unitsSold',
        key: 'unitsSold'
      },
      {
        title: 'Consumers',
        dataIndex: 'consumers',
        key: 'consumers'
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline
              title={<p style={styles.blodFont}> {title}</p>}
              extra={
                <div>
                  <RangePicker onChange={this.onChangeDate} disabledDate={this.disabledDate} defaultValue={[moment(new Date(this.dateCalculate(7)), 'YYYY-MM-DD'), moment(new Date(sessionStorage.getItem('defaultLocalDateTime')), 'YYYY-MM-DD')]} format={'YYYY-MM-DD'} />
                </div>
              }
            />
            <div>
              <h4 style={styles.blodFont}>Sales Overview</h4>
              <div className="data-statistics-transaction" style={{ width: 1200 }}>
                {overviewList &&
                  overviewList.map((item, index) => (
                    <div className="mode" key={index}>
                      <div className="mode-text" style={item.name === 'Sales per visitor' ? {} : styles.borderRight}>
                        {item.name}
                      </div>
                      <div className="mode-num" style={item.name === 'Sales per visitor' ? {} : styles.borderRight}>
                        <span>
                          {item && (item.name == 'Revenue' || item.name == 'Average basket') ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : null}
                          {item && (item.value || item.value === 0) ? <CountUp end={item.value} decimals={item.value.toString().indexOf('.') !== -1 ? 2 : 0} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                      <div className="mode-per" style={item.name === 'Sales per visitor' ? {} : styles.borderRight}>
                        {item && (item.rate || item.rate === 0) ? (
                          <>
                            <img src={item.rate >= 0 ? icon1 : icon2} width="14" height="14" />
                            <span className={item.rate > 0 ? 'green' : 'red'}>
                              <CountUp end={Math.abs(item.rate)} decimals={2} suffix={'%'} {...countUpProps} />
                            </span>
                          </>
                        ) : (
                          '--'
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div style={styles.itemDisplay}>
              <h4 style={styles.blodFont}>Subscription</h4>
              <div className="data-statistics-transaction">
                {subscriptionList &&
                  subscriptionList.map((item, index) => (
                    <div className="mode" key={index}>
                      <div className="mode-text" style={item.name === 'Subscription transaction amount' ? styles.paddingRightZero : styles.borderRight}>
                        {item.name}
                      </div>
                      {item.name === 'Subscription rate' ? (
                        <div className="mode-num" style={styles.borderRight}>
                          <span> {item && (item.value || item.value === 0) ? <CountUp end={item.value} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</span>
                        </div>
                      ) : (
                        <div className="mode-num" style={item.name === 'Subscription transaction amount' ? styles.paddingRightZero : styles.borderRight}>
                          <span>
                            {item.name == 'Subscription transaction amount' ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : null}
                            {item && (item.value || item.value === 0) ? <CountUp end={item.value} decimals={item.value.toString().indexOf('.') !== -1 ? 2 : 0} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      )}
                      <div className="mode-per" style={item.name === 'Subscription transaction amount' ? styles.paddingRightZero : styles.borderRight}>
                        {item && (item.rate || item.rate === 0) ? (
                          <>
                            <img src={item.rate >= 0 ? icon1 : icon2} width="14" height="14" />
                            <span className={item.rate > 0 ? 'green' : 'red'}>
                              <CountUp end={Math.abs(item.rate)} decimals={2} suffix={'%'} {...countUpProps} />
                            </span>
                          </>
                        ) : (
                          '--'
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="container-search">
            <Headline
              title={<p style={styles.blodFont}>Transaction trend</p>}
              // title= "Transaction trend"
              extra={
                <div>
                  <Select defaultValue="Week trend" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="Week trend">Week trend</Option>
                    <Option value="Day trend">Day trend</Option>
                  </Select>
                </div>
              }
            />
            <div id="main" style={{ width: '100%', height: 400, margin: '0 auto' }}></div>
          </div>

          <div className="container-search">
            <Headline
              title={<p style={styles.blodFont}>Transaction report</p>}
              // title="Transaction report"
              extra={
                <AuthWrapper functionName="f_export_transaction_data">
                  <Button type="primary" shape="round" icon="download" onClick={() => this.onExport()}>
                    <span style={{ color: '#ffffff' }}>Download the report</span>
                  </Button>
                </AuthWrapper>
              }
            />
            <Table columns={columns} rowKey={(record, index) => index.toString()} dataSource={tableData} pagination={pagination} onChange={this.handleTableChange} />
          </div>
        </Spin>
      </div>
    );
  }
}
const styles = {
  borderRight: {
    borderRight: '1px solid #d9d9d9'
  },
  itemDisplay: {
    width: 800,
    display: 'inline-block',
    marginRight: 10
  },
  paddingRightZero: {
    paddingRight: 0
  },
  blodFont: {
    fontWeight: 600
  }
} as any;
