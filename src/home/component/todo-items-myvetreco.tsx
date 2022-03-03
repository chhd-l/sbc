import React from 'react';
import {Relax} from 'plume2';
import {Link} from 'react-router-dom';

import {Spin} from 'antd';
//import { fromJS } from 'immutable';

import {AuthWrapper, cache, RCi18n, history, noop, util} from 'qmkit';
/*import { IList } from 'typings/globalType';
// import { FormattedMessage } from 'react-intl';*/
import PieChart from 'web_modules/biz/chart-pie/index.tsx';
// import Funnel from 'web_modules/biz/funnel/funnel.tsx';
import Bar from 'web_modules/biz/bar/index.tsx';
import BarLine from 'web_modules/biz/BarLine/index.tsx';
import CountUp from 'react-countup';
import nodataImg from '../images/no-data.jpg';
import {FormattedMessage, injectIntl} from 'react-intl';

const icon1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAD50lEQVRYCcVYMW8dRRCemV2fsRNQkBwUp0iCRAUFSgAJCiQkIBFOQDRQ8QcQHR0VLiiiSBSRCFUEBSKWiJSCEEcBOoTcABFCVFShSBoLmYBf/O7d7jDfhb3cO9+99yzb8pOs3Zmdme+7udndOTNt4ffW719lvTC7Ly+yGY19P63s86Aucxz6rAXLdJH5/N6s661ffurtfNLQPM5QVfnVn79/JJP8wCCP2Tj7tD5lDma+9t0zr9xlZk36tnEkiZO/3tjnQzG3FfAmCMgUzq9++/Sp9eZakltJ4OkXfrg+V2ThQDLc7uhzt7b84murbVnZRGJRVX5a+Wa+LzS7XeCm/3Sk3rMvnLmzyBzra1IXkIHdIgAcPBjiA6eOO0QCr2A3MlAHRHzg1HUVIxSh3ssP1xc3zUN8XSke26RvUzD3if0N2xi3WpdnstupWD0MkJ7TN5fnBm3WSQcCGj9O4thRbVdK8U7k7GWhsCk0dp3h9lCo5evAObCdbdhJKOohKcKxtnXgARdrZSbKg6jNsq5zcpWDZW2S16F0xlwfv+8e7BW7P+qh0hy4Nv/b4yhe+2fCkxBEaKiWU7xy1EjPeeZ/BzGfZ+WSRBSd7/JANoDvcRfg+bbzsxNRXN4/a8X1ZmGBhN2SZawMaW98flRs4NuZms2MMhq3ZjXtjcB5EEi2kflumhPFkTsO+ILb8IHD1mby0FRGWnxqBE4lT2ZZcqwrD2QemQngC67j5LCVUZhmw/rGRYr6UuXH9Bk5+dDOh9uVLtJIEsAX9AOVw4QT8fRwKIrPLQPPJxclvsDOny3l4O9UetZDkY1yxw/4goakY71VLbF4tNgovrBaPp4MmOmceHc+yWpFYvO/SllpKsbiYFprjsAXdETNhS7ZHuhgiPylPdaTpQ2aFZZFcv5i08cWqmwId+8Q4Nv69GQkoh6O+WDJtvMTADQiwf4+YCeXmgQgC3NVF6zaWRfAF/SEbUHqOtuGRykGI0BHSj3TIDr/Pjl3pW43NGeaiATwBU3pkHNDUOf22/1zyY6z+0+j1Hfi37NSu94wHRaVfqsUSqvVvDEBflm1C79cO9p5gcVwUqN+Al+78XrWjrzL4lYasdrFEN+wBbVte7XNAP3n8onTt8ozAl0x08ZjbYbkp36kQb7CxPtV5CMjcrPVrk3p5Os2ddIBF/MyE//3E0c6s5G8dnBEFq4dX/iz6icwQVu+gxhjQwEPuDCsblm0WmjLx3rvgAFwUms3RAICvgvQlu8ATmcIxAdO3aDKBJRID74LdosI4iJ+eg2JSFmYSUgjCnVPv8ASEYx7+i1aJ4Ks7OlXeZ0M5rv1/4n/ANnU1qrBziWWAAAAAElFTkSuQmCC';
const icon2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAEEklEQVRYCcVYO2wcRRie167vkVzsJA62Y4STQGUFYUBIESIFCBBIgECiMKEBuUIIpQqUpkoT6KgRdYQoaHgICUFDgTBCCkg4ds7GvgTFUiI/7rE7O5P51vznvfWuLxds55p//sf837fz7878c5z18Lsy/qZ/XNTLqyooqsCqUDAldCCN8iPPMK19rivabyyb0sb4lcvB3abm3QKttXz+yecrRWP6o6b2u8WTXxZU0BDi9slfv1/lnFuyZ8kdSdx49IWykfpoL+BpEJARkVoZ+uO7jbSP9EwSePqrj589Wmjyfgr8v7JZsLcf/u2nlaxVEenkdnpaLD323MhuEgAG8iEv8qcxO1YCK4BAFuhSOnDXdF/VR3//oZZckQ5WKMGeEsCTuAeMcRJP1SaBl3C3S5DA6RgCB3hkjEmgDPgKyLgfEnjABVZMAvtA3mfY12iUzez8F3Z27kteq03sFkHgAbdNAhtRXvJw5dbTzJgz1tjTZq3+OV9ePpMXm7bz6j+v8urSK2k76YQrsRX74doRcqSl78l/o9W1N5wdNfRsEL2smo2/bKVSTccmdRCIWq1LNtIvivV6lfVX/k76MbbayKkHnloXOAvSzqTeKpXW5eCht1zlrm/abV+40fzMVBdfSsalxybSp8lmbP77BnyBw4iC86Q5PLggjg1McsYXN2Osx1vBp44IVij7Z8wIObjy/nsAsmxJ4AuchlumHUYDAzU5NDjJGL+KKHciSUfkIru26FZp+88yu0VCqlwSwBc4jrenyLaYQ5WbYmT4HBPiT0Q4ItwEwTSbX5zaNsOwYbJF5WIuibgdQD9AwXclD5ZuFY8Pve2IzFC8CYMLdn7hA9JtUO9z48ObOg9l5cBN8qUl8AUakrSjmx6/rA+OvMOF+IVibRi+b+cWPoIu1zbaq+B2oxuWi9x+AvgCHREl6kXaQqHujQ1POSI/0jyrw3fZ3LWPdSPYeh8Ezy0F5gFfoCWjJL1K7RUDdWL0PSvENzTX6GiSB2F7QzNdSABfoCekBPciI+Vr79RD54WSX9F8bmy8HUPnXNTIniWBL9CUZjl7sRkhDTt14kNxoHxOVQ6+Zjj3aL7htMmRpVMCX6Errk08G+QdYMkpOAciE40lbemxgUGbJ8guPZn7TqD/HJ+5HMR7BLpi10Yfo4lZMibQan6S5dvRprzccgAXc+OjHG05WO2Y7B6c+DzVkeyDDnjARdp4JdDvuU5nJWK6/WmlMe3Y6NeyusS6lYPmOQIt2V/6Vnt9IdmSEtcA6jPjzoacsxPPDO5Hi4f2/5GZn9u7aFwOIoF7AXPdMOl7Il3+GCeRvIMElmf09bPX94wI2n2Xn8pAPDrKQcb9voFlkiAy9/UuSiQgsSr39VaeJIPxXv0/cQeTu+OSeUihNAAAAABJRU5ErkJggg==';

const countUpProps = {
  start: 0,
  duration: 1.3,
  useEasing: false,
  useGrouping: true,
  separator: ','
};

@Relax
class TodoItemsMyvet extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      tradeCustomerView: '',
      goodsInfoTopView: '',
      prescriberTrendView: '',
      prescriberTopView: '',
      trafficDashboardView: '',
      transactionTrendView: '',
      trafficTrendDashboardView: '',
      conversionFunnelDashboardView: '',
      taskEmployeeStatisticsView: {},
      prescriberTradeTopView: '',
      prescriberTradeAndItemTopView: '',
      prescriberTradeItemTopView: '',
      prescriberRecommentCodeUseView: '',
    };
  }

  props: {
    relaxProps?: {
      loading: boolean;
      tradeCustomerView: any;
      goodsInfoTopView: any;
      prescriberTrendView: any;
      prescriberTopView: any;
      trafficDashboardView: any;
      taskEmployeeStatisticsView: any;
      transactionTrendView: any;
      trafficTrendDashboardView: any;
      conversionFunnelDashboardView: any;
      cleanRedux: Function;
      prescriberTradeTopView: any;
      prescriberTradeAndItemTopView: any;
      prescriberTradeItemTopView: any;
      prescriberRecommentCodeUseView: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    tradeCustomerView: 'tradeCustomerView',
    goodsInfoTopView: 'goodsInfoTopView',
    prescriberTrendView: 'prescriberTrendView',
    prescriberTopView: 'prescriberTopView',
    trafficDashboardView: 'trafficDashboardView',
    taskEmployeeStatisticsView: 'taskEmployeeStatisticsView',
    transactionTrendView: 'transactionTrendView',
    trafficTrendDashboardView: 'trafficTrendDashboardView',
    conversionFunnelDashboardView: 'conversionFunnelDashboardView',
    prescriberTradeTopView: 'prescriberTradeTopView',
    prescriberTradeAndItemTopView: 'prescriberTradeAndItemTopView',
    prescriberTradeItemTopView: 'prescriberTradeItemTopView',
    prescriberRecommentCodeUseView: 'prescriberRecommentCodeUseView',
    cleanRedux: noop
  };

  componentWillUnmount() {
    const {cleanRedux} = this.props.relaxProps;
    cleanRedux();
    this.setState = (state, callback) => {
      return;
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      tradeCustomerView, goodsInfoTopView, prescriberTrendView, prescriberTopView, trafficDashboardView, transactionTrendView, trafficTrendDashboardView, conversionFunnelDashboardView,
      prescriberTradeTopView, prescriberTradeAndItemTopView, prescriberTradeItemTopView, taskEmployeeStatisticsView, prescriberRecommentCodeUseView
    } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    if (
      tradeCustomerView !== prevState.tradeCustomerView ||
      goodsInfoTopView !== prevState.goodsInfoTopView ||
      prescriberTrendView !== prevState.prescriberTrendView ||
      prescriberTopView !== prevState.prescriberTopView ||
      trafficDashboardView !== prevState.trafficDashboardView ||
      transactionTrendView !== prevState.transactionTrendView ||
      trafficTrendDashboardView !== prevState.trafficTrendDashboardView ||
      conversionFunnelDashboardView !== prevState.conversionFunnelDashboardView ||
      taskEmployeeStatisticsView !== prevState.taskEmployeeStatisticsView ||
      prescriberTradeTopView !== prevState.prescriberTradeTopView ||
      prescriberTradeAndItemTopView !== prevState.prescriberTradeAndItemTopView ||
      prescriberTradeItemTopView !== prevState.prescriberTradeItemTopView ||
      prescriberRecommentCodeUseView !== prevState.prescriberRecommentCodeUseView
    ) {
      return {
        tradeCustomerView,
        goodsInfoTopView,
        prescriberTrendView,
        prescriberTopView,
        trafficDashboardView,
        transactionTrendView,
        trafficTrendDashboardView,
        conversionFunnelDashboardView,
        taskEmployeeStatisticsView,
        prescriberRecommentCodeUseView
      };
    }

    // 否则，对于state不进行任何操作
    return null;
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {loading, prescriberTradeAndItemTopView, prescriberTradeTopView, prescriberTradeItemTopView} = this.props.relaxProps;
    const {tradeCustomerView, goodsInfoTopView, prescriberTrendView, prescriberTopView, trafficDashboardView, transactionTrendView, trafficTrendDashboardView,
      conversionFunnelDashboardView, taskEmployeeStatisticsView, prescriberRecommentCodeUseView} = this.state;
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));

    return (
      <div className="item">
        <Spin spinning={loading} delay={500}>
          <div className="item-top space-between">
            <div className="item-top-l flex-content">
              <div className="item-top-l-top">
                <div className="top-text"><FormattedMessage id="Home.Overview"/></div>
                <div className="content space-between">
                  <div className="mode">
                    <div className="mode-text"><FormattedMessage id="Home.Revenue"/></div>
                    <div className="mode-num">
                      <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                      <span>{tradeCustomerView && tradeCustomerView.revenue != null ? <CountUp end={tradeCustomerView.revenue} decimals={2} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.revenueRate != null ? <img src={tradeCustomerView.revenueRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.revenueRate != null ? (tradeCustomerView.revenueRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.revenue != null ? <CountUp end={Math.abs(tradeCustomerView.revenueRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text"><FormattedMessage id="Home.AverageBasket"/></div>
                    <div className="mode-num">
                      <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                      <span>{tradeCustomerView && tradeCustomerView.averageBasket != null ? <CountUp end={tradeCustomerView.averageBasket} decimals={2} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <img src={tradeCustomerView.averageBasketRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.averageBasketRate ? (tradeCustomerView.averageBasketRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <CountUp end={Math.abs(tradeCustomerView.averageBasketRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text"><FormattedMessage id="Home.Conversion"/></div>
                    <div className="mode-num">
                      <span>{tradeCustomerView && tradeCustomerView.conversion != null ? <CountUp end={tradeCustomerView.conversion} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.conversionRate != null ? <img src={tradeCustomerView.conversionRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.conversionRate != null ? (tradeCustomerView.conversionRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.conversionRate != null ? <CountUp end={Math.abs(tradeCustomerView.conversionRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  {/*<div className="line"></div>*/}
                  {/*<div className="mode">*/}
                  {/*  <div className="mode-text"><FormattedMessage id="Home.Traffic"/></div>*/}
                  {/*  <div className="mode-num">{tradeCustomerView && tradeCustomerView.traffic != null ? <CountUp end={tradeCustomerView.traffic} {...countUpProps} /> : '--'}</div>*/}
                  {/*  <div className="mode-per">*/}
                  {/*    {tradeCustomerView && tradeCustomerView.trafficRate != null ? <img src={tradeCustomerView.trafficRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}*/}
                  {/*    <span className={tradeCustomerView && tradeCustomerView.trafficRate != null ? (tradeCustomerView.trafficRate >= 0 ? 'green' : 'red') : ''}>*/}
                  {/*      {tradeCustomerView && tradeCustomerView.trafficRate != null ? <CountUp end={Math.abs(tradeCustomerView.trafficRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>
              <div className="item-top-l-btm">
                <div className="top-text"><FormattedMessage id="Home.Subscription"/></div>
                <div className="subscription space-between">
                  <div className="subscription-l">
                    <PieChart total="100" shelves={tradeCustomerView && tradeCustomerView.subscriptionRate != null ? tradeCustomerView.subscriptionRate : 0}/>
                  </div>
                  <div className="subscription-r flex-content">
                    <div className="subscription-content space-around">
                      <div className="text"><FormattedMessage id="Home.OrderNumber"/></div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.subscriptionNumber != null ? <CountUp end={tradeCustomerView.subscriptionNumber} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <img src={tradeCustomerView.subscriptionNumberRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? (tradeCustomerView.subscriptionNumberRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <CountUp end={Math.abs(tradeCustomerView.subscriptionNumberRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="subscription-content space-around">
                      <div className="text"><FormattedMessage id="Home.Salesvolume"/></div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.subscriptionRevenue != null ? <CountUp end={tradeCustomerView.subscriptionRevenue} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? <img src={tradeCustomerView.subscriptionRevenueRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? (tradeCustomerView.subscriptionRevenueRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? <CountUp end={Math.abs(tradeCustomerView.subscriptionRevenueRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item-top-r flex-content">
              <div className="item-top-r-top flex-content">
                <div className="item-top-r-top-l" style={{width:'100%'}}>
                  <div className="top-text"><FormattedMessage id="Home.Consumer"/></div>
                  <div className="consumer flex-content">
                    <div className="consumer-top flex-start">
                      <div className="mode">
                        <div className="mode-text"><FormattedMessage id="Home.Activeconsumers"/></div>
                        <div className="mode-num">
                          {/*<span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>*/}
                          <span>{tradeCustomerView && tradeCustomerView.activeConsumers != null ? <CountUp end={tradeCustomerView.activeConsumers} {...countUpProps} /> : '--'}</span>
                        </div>
                        <div className="mode-per">
                          {tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? <img src={tradeCustomerView.activeConsumersRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? (tradeCustomerView.activeConsumersRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? <CountUp end={Math.abs(tradeCustomerView.activeConsumersRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                        </div>
                      </div>
                      <div className="mode">
                        <div className="mode-text"><FormattedMessage id="Home.Activeconsumerrate"/></div>
                        <div className="mode-num">
                          <span>{tradeCustomerView && tradeCustomerView.activeConsumerRate != null ? <CountUp end={tradeCustomerView.activeConsumerRate} suffix={'%'} decimals={2} {...countUpProps} /> : '--'}</span>
                        </div>
                        <div className="mode-per">
                          {tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? <img src={tradeCustomerView.activeConsumerRateRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? (tradeCustomerView.activeConsumerRateRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? <CountUp end={Math.abs(tradeCustomerView.activeConsumerRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                        </div>
                      </div>
                    </div>
                    <div className="consumer-btm flex-content">
                      <div className="mode">
                        <div className="mode-text"><FormattedMessage id="Home.Totalconsumers"/></div>
                        <div className="mode-num">
                          <span>{tradeCustomerView && tradeCustomerView.totalConsumers != null ? <CountUp end={tradeCustomerView.totalConsumers} {...countUpProps} /> : '--'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-top-r-btm">
                <div className="top-text space-between">
                  <span><FormattedMessage id="Home.Transaction"/></span>
                  <span>
                    <AuthWrapper functionName="f_home_transaction_more"><Link to="/report-transaction"><FormattedMessage id="Home.more"/> &gt;</Link></AuthWrapper>
                  </span>
                </div>
                <div className="m-content flex-content">
                  <div className="transaction space-between">
                    <div className="transaction-l space-around">
                      <div className="text"><FormattedMessage id="Home.OrderNumber"/></div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.orderNumber != null ? <CountUp end={tradeCustomerView.orderNumber} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.orderNumberRate != null ? <img src={tradeCustomerView.orderNumberRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.orderNumberRate != null ? (tradeCustomerView.orderNumberRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.orderNumberRate != null ? <CountUp end={Math.abs(tradeCustomerView.orderNumberRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-l space-around">
                      <div className="text"><FormattedMessage id="Home.Salesvolume"/></div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.salesVolume != null ? <CountUp end={tradeCustomerView.salesVolume} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? <img src={tradeCustomerView.salesVolumeRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? (tradeCustomerView.salesVolumeRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? <CountUp end={Math.abs(tradeCustomerView.salesVolumeRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="transaction space-between">
                    <div className="transaction-l space-around">
                      <div className="text"><FormattedMessage id="Home.Unitssold"/></div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.unitsSold != null ? <CountUp end={tradeCustomerView.unitsSold} decimals={2} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? <img src={tradeCustomerView.unitsSoldRate >= 0 ? icon1 : icon2} width="14" height="14"/> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? (tradeCustomerView.unitsSoldRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? <CountUp end={Math.abs(tradeCustomerView.unitsSoldRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/**
                     * 不展示Retention rate
                     * @author weili
                     */}
                    <div className="transaction-l space-around">
                      {/*<div className="text"><FormattedMessage id="Home.Retentionrate"/></div>*/}
                      {/*<div className="num">*/}
                      {/*  <div className="num-l">{tradeCustomerView && tradeCustomerView.retentionRate != null ? <CountUp end={tradeCustomerView.retentionRate} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</div>*/}
                      {/*  <div className="num-r">*/}
                      {/*    {tradeCustomerView && tradeCustomerView.retentionRateRate != null ? <img src={tradeCustomerView.retentionRateRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}*/}
                      {/*    <span className={tradeCustomerView && tradeCustomerView.retentionRateRate != null ? (tradeCustomerView.retentionRateRate >= 0 ? 'green' : 'red') : ''}>*/}
                      {/*      {tradeCustomerView && tradeCustomerView.retentionRateRate != null ? <CountUp end={Math.abs(tradeCustomerView.retentionRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}*/}
                      {/*    </span>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* begin */}

            {/* end */}
          </div>

          <div className="item-btm space-between">
            <div className="item-btm-m">
              <div className="top-text space-between">
                <span><FormattedMessage id="Home.Bestseller"/></span>
                <span>
                  <AuthWrapper functionName="f_home_bestseller_more"><Link to="/report-product"><FormattedMessage id="Home.more"/> &gt;</Link></AuthWrapper>
                </span>
              </div>
              {goodsInfoTopView && goodsInfoTopView.length === 0 ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img"/>
                </div>
              ) : (
                <div className="seller space-between">
                  {goodsInfoTopView &&
                  goodsInfoTopView.map((item, i) => {
                    return (
                      <div className="seller-pro flex-start" key={i}>
                        <div className="text"><FormattedMessage id="Home.TOP"/> {i + 1}</div>
                        <div className="seller-content flex-content-start">
                          <img src={util.optimizeImage(item.goodsInfoImg)} alt="" style={{width:66,height:94,margin:'0 auto'}} />
                          <div className="content-text1 font-line1">{item.goodsInfoName}</div>
                          <div className="content-text2">{item.marketPrice + ' ' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</div>
                          <div className="content-text3">{item.salesVolume} <FormattedMessage id="Home.units"/></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="item-btm-r">

              <div className="top-text space-between">
                <span><FormattedMessage id="Home.TransactionTrend"/></span>
                <span>
                  <AuthWrapper functionName="f_home_transactiontrend_more"><Link to="/report-transaction"><FormattedMessage id="Home.more"/> &gt;</Link></AuthWrapper>
                </span>
              </div>
              {!transactionTrendView || (!transactionTrendView.weekNumList && !transactionTrendView.revenueList && !transactionTrendView.transactionList) ||
              (transactionTrendView.weekNumList && transactionTrendView.weekNumList.length === 0 && transactionTrendView.revenueList && transactionTrendView.revenueList.length === 0 && transactionTrendView.transactionList && transactionTrendView.transactionList.length === 0) ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img"/>
                </div>
              ) : (
                <div className="line">
                  {transactionTrendView && (
                    <BarLine
                      yName={{y1: (window as any).RCi18n({id: 'Home.Revenue'}), y2: (window as any).RCi18n({id: 'Home.Transaction'})}}
                      unit={{unit1: '', unit2: ''}}
                      nameTextStyle={{y1: [0, 52, 0, 0], y2: [0, 22, 0, 0]}}
                      data={{
                        x: transactionTrendView.weekNumList,
                        y1: transactionTrendView.revenueList,
                        y2: transactionTrendView.transactionList
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          

          

        </Spin>
      </div>
    );
  }
}

export default injectIntl(TodoItemsMyvet)
