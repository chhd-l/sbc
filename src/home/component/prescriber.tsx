import React from 'react';
import { IMap, Relax } from 'plume2';
import { Icon, Modal, Checkbox, Spin } from 'antd';
//import { fromJS } from 'immutable';

import {cache, RCi18n, history, noop, AuthWrapper} from 'qmkit';
//import { IList } from 'typings/globalType';
//import { FormattedMessage } from 'react-intl';
import PieChart from 'web_modules/biz/chart-pie/index.tsx';
import Funnel from 'web_modules/biz/funnel/funnel.tsx';
import BarLine from '/web_modules/biz/BarLine/index.tsx';
import CountUp from 'react-countup';
import nodataImg from '@/home/images/no-data.jpg';
import { FormattedMessage, injectIntl } from 'react-intl';
import Bar from '../../../web_modules/biz/bar';

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
@Relax
class Prescriber extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      prescriberId: '',
      tradeCustomerView: {},
      goodsInfoTopView: '',
      prescriberTrendView: '',
      prescriberTopView: '',
      trafficDashboardView: '',
      transactionTrendView: '',
      trafficTrendDashboardView: '',
      conversionFunnelDashboardView: '',
      p_prescriberRecommentCodeUseView: ''
    };
  }

  props: {
    relaxProps?: {
      loading: boolean;
      p_tradeCustomerView: any;
      p_prescriberTopView: any;
      p_transactionTrendView: any;
      p_trafficTrendDashboardView: any;
      p_conversionFunnelDashboardView: any;
      p_trafficDashboardView: any;
      p_prescriberRecommentCodeUseView: any;
    };
    intl: any;
  };

  static relaxProps = {
    p_tradeCustomerView: 'p_tradeCustomerView',
    p_prescriberTopView: 'p_prescriberTopView',
    p_transactionTrendView: 'p_transactionTrendView',
    p_trafficTrendDashboardView: 'p_trafficTrendDashboardView',
    p_conversionFunnelDashboardView: 'p_conversionFunnelDashboardView',
    p_trafficDashboardView: 'p_trafficDashboardView',
    p_prescriberRecommentCodeUseView: 'prescriberRecommentCodeUseView',
    loading: 'loading'
  };

  componentWillUnmount() {
    //const { tradeCustomerView } = this.props.relaxProps as any;
    if (JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA)).prescribers) {
      let o = {
        value: JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA)).prescribers[0].id,
        children: JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA)).prescribers[0].prescriberName
      };
      let act = JSON.stringify(o);
      if (sessionStorage.getItem('PrescriberType') === null) {
        sessionStorage.setItem('PrescriberType', act);
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prescriberId, p_tradeCustomerView, p_prescriberTopView, p_transactionTrendView, p_trafficTrendDashboardView,
      p_conversionFunnelDashboardView, p_trafficDashboardView, p_prescriberRecommentCodeUseView } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    if (
      prescriberId !== prevState.prescriberId ||
      p_tradeCustomerView !== prevState.tradeCustomerView ||
      p_prescriberTopView !== prevState.prescriberTopView ||
      p_transactionTrendView !== prevState.transactionTrendView ||
      p_trafficTrendDashboardView !== prevState.trafficTrendDashboardView ||
      p_conversionFunnelDashboardView !== prevState.conversionFunnelDashboardView ||
      p_trafficDashboardView !== prevState.trafficDashboardView ||
      p_prescriberRecommentCodeUseView !== prevState.p_prescriberRecommentCodeUseView
    ) {
      return {
        tradeCustomerView: p_tradeCustomerView,
        prescriberTopView: p_prescriberTopView,
        transactionTrendView: p_transactionTrendView,
        trafficTrendDashboardView: p_trafficTrendDashboardView,
        conversionFunnelDashboardView: p_conversionFunnelDashboardView,
        trafficDashboardView: p_trafficDashboardView,
        p_prescriberRecommentCodeUseView: p_prescriberRecommentCodeUseView,
        prescriberId
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
    const { loading } = this.props.relaxProps;
    const { tradeCustomerView, trafficDashboardView, transactionTrendView, trafficTrendDashboardView, conversionFunnelDashboardView, p_prescriberRecommentCodeUseView } = this.state;
    return (
      <div className="prescriber-item">
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="item-top space-between">
            <div className="item-top-l flex-content">
              <div className="item-top-l-top">
                <div className="top-text">
                  <FormattedMessage id="Home.Overview" />
                </div>
                <div className="content space-between">
                  <div className="mode">
                    <div className="mode-text">
                      <FormattedMessage id="Home.Revenue" />
                    </div>
                    <div className="mode-num">
                      <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                      <span>{tradeCustomerView && tradeCustomerView.revenue != null ? <CountUp end={tradeCustomerView.revenue} decimals={2} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.revenueRate != null ? <img src={tradeCustomerView.revenueRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.revenueRate != null ? (tradeCustomerView.revenueRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.revenue != null ? <CountUp end={Math.abs(tradeCustomerView.revenueRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text">
                      <FormattedMessage id="Home.Averagebasket" />
                    </div>
                    <div className="mode-num">
                      <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                      <span>{tradeCustomerView && tradeCustomerView.averageBasket != null ? <CountUp end={tradeCustomerView.averageBasket} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <img src={tradeCustomerView.averageBasketRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.averageBasketRate != null ? (tradeCustomerView.averageBasketRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <CountUp end={Math.abs(tradeCustomerView.averageBasketRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text">
                      <FormattedMessage id="Home.Conversion" />
                    </div>
                    <div className="mode-num">
                      <span>{tradeCustomerView && tradeCustomerView.conversion != null ? <CountUp end={tradeCustomerView.conversion} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.conversionRate != null ? <img src={tradeCustomerView.conversionRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.conversionRate != null ? (tradeCustomerView.conversionRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.conversionRate != null ? <CountUp end={Math.abs(tradeCustomerView.conversionRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  {/*<div className="line"></div>*/}
                  {/*<div className="mode">*/}
                  {/*  <div className="mode-text">*/}
                  {/*    <FormattedMessage id="Home.Traffic" />*/}
                  {/*  </div>*/}
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
            </div>

            <div className="item-top-r flex-content">
              <div className="item-top-r-top">
                <div className="top-text">
                  <FormattedMessage id="Home.Consumer" />
                </div>
                <div className="consumer flex-content">
                  <div className="consumer-top flex-start">
                    <div className="mode">
                      <div className="mode-text">
                        <FormattedMessage id="Home.Activeconsumers" />
                      </div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.activeConsumers != null ? <CountUp end={tradeCustomerView.activeConsumers} {...countUpProps} /> : '--'}</span>
                      </div>
                      <div className="mode-per">
                        {tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? <img src={tradeCustomerView.activeConsumersRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? (tradeCustomerView.activeConsumersRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.activeConsumersRate != null ? <CountUp end={Math.abs(tradeCustomerView.activeConsumersRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                    </div>
                    <div className="mode">
                      <div className="mode-text">
                        <FormattedMessage id="Home.Activeconsumerrate" />
                      </div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.activeConsumerRate != null ? <CountUp end={tradeCustomerView.activeConsumerRate} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</span>
                      </div>
                      <div className="mode-per">
                        {tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? <img src={tradeCustomerView.activeConsumerRateRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? (tradeCustomerView.activeConsumerRateRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.activeConsumerRateRate != null ? <CountUp end={Math.abs(tradeCustomerView.activeConsumerRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="consumer-btm flex-content">
                    <div className="mode">
                      <div className="mode-text">
                        <FormattedMessage id="Home.Totalconsumers" />
                      </div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.totalConsumers != null ? <CountUp end={tradeCustomerView.totalConsumers} {...countUpProps} /> : '--'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-btm space-between">
            <div className="item-btm-l">
              <div className="top-text">
                <FormattedMessage id="Home.Subscription" />
              </div>
              <div className="subscription flex-content">
                <div className="subscription-top">
                  <PieChart total="100" shelves={tradeCustomerView && tradeCustomerView.subscriptionRate != null ? tradeCustomerView.subscriptionRate : 0} />
                </div>
                <div className="subscription-btm">
                  <div className="consumer-top flex-start">
                    <div className="mode">
                      <div className="mode-text">
                        <FormattedMessage id="Home.OrderNumber" />
                      </div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.subscriptionNumber != null ? <CountUp end={tradeCustomerView.subscriptionNumber} {...countUpProps} /> : '--'}</span>
                      </div>
                      <div className="mode-per">
                        {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <img src={tradeCustomerView.subscriptionNumberRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? (tradeCustomerView.subscriptionNumberRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <CountUp end={Math.abs(tradeCustomerView.subscriptionNumberRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                    </div>
                    <div className="mode">
                      <div className="mode-text">
                        <FormattedMessage id="Home.Salesvolume" />
                      </div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.subscriptionRevenue != null ? <CountUp end={tradeCustomerView.subscriptionRevenue} {...countUpProps} /> : '--'}</span>
                      </div>
                      <div className="mode-per">
                        {tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? <img src={tradeCustomerView.subscriptionRevenueRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? (tradeCustomerView.subscriptionRevenueRate >= 0 ? 'green' : 'red') : ''}>
                          {tradeCustomerView && tradeCustomerView.subscriptionRevenueRate != null ? <CountUp end={Math.abs(tradeCustomerView.subscriptionRevenueRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-btm-r">
              <div className="top-text space-between">
                <span>
                  <FormattedMessage id="Home.TransactionTrend" />
                </span>
                {/*<span>more ></span>*/}
              </div>
              {!transactionTrendView || (transactionTrendView.weekNumList.length === 0 && transactionTrendView.revenueList.length === 0 && transactionTrendView.transactionList.length === 0) ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img" />
                </div>
              ) : (
                <div className="line">
                  {transactionTrendView && (
                    <BarLine
                      yName={{ y1: (window as any).RCi18n({ id: 'Home.Revenue' }), y2: (window as any).RCi18n({ id: 'Home.Transaction' }) }}
                      unit={{ unit1: '', unit2: '' }}
                      nameTextStyle={{ y1: [0, 0, 0, 0], y2: [0, 22, 0, 0] }}
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

          {/*<AuthWrapper functionName="f_home_best_prescriber">
            <div className="item-best">
              <div className="top-text"><FormattedMessage id="Home.BestPrescriber"/></div>
              <div className="item-best-main space-between">
                <div className="best-main">
                  <div className="main-text"><FormattedMessage id="Home.UJ1&UJ2Prescriber"/></div>
                  {!prescriberTradeAndItemTopView ||
                  (prescriberTradeAndItemTopView.prescriberNameList.length === 0 && prescriberTradeAndItemTopView.numList.length === 0)
                    ? (
                      <div className="data-img">
                        <img src={nodataImg} className="no-data-img"/>
                      </div>
                    ) : (
                      <div className="main-chart">
                        {prescriberTradeAndItemTopView && (
                          <Bar
                            yName={{y1: (window as any).RCi18n({id: 'Home.UJ1&UJ2'})}}
                            unit={{unit1: '', unit2: '%'}}
                            nameTextStyle={{y1: [0, 0, 0, 42], y2: [0, 0, 0, 22]}}
                            data={{
                              x: prescriberTradeAndItemTopView.prescriberNameList,
                              y1: prescriberTradeAndItemTopView.numList
                            }}
                          />
                        )}
                      </div>
                    )}
                </div>
                <div className="best-main">
                  <div className="main-text"><FormattedMessage id="Home.UJ1Prescriber"/></div>
                  {!prescriberTradeTopView ||
                  (!prescriberTradeTopView.prescriberNameList || prescriberTradeTopView.numList.length === 0) ? (
                    <div className="data-img">
                      <img src={nodataImg} className="no-data-img"/>
                    </div>
                  ) : (
                    <div className="main-chart">
                      {prescriberTradeTopView && (
                        <Bar
                          yName={{y1: (window as any).RCi18n({id: 'Home.UJ1'})}}
                          unit={{unit1: '', unit2: '%'}}
                          nameTextStyle={{y1: [0, 0, 0, 42], y2: [0, 0, 0, 22]}}
                          data={{
                            x: prescriberTradeTopView.prescriberNameList,
                            y1: prescriberTradeTopView.numList
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="best-main">
                  <div className="main-text"><FormattedMessage id="Home.UJ2Prescriber"/></div>
                  {!prescriberTradeItemTopView || (prescriberTradeItemTopView.prescriberNameList.length === 0 && prescriberTradeItemTopView.numList.length === 0) ? (
                    <div className="data-img">
                      <img src={nodataImg} className="no-data-img"/>
                    </div>
                  ) : (
                    <div className="main-chart">
                      {prescriberTradeItemTopView && (
                        <Bar
                          yName={{y1: (window as any).RCi18n({id: 'Home.UJ2'})}}
                          unit={{unit1: '', unit2: '%'}}
                          nameTextStyle={{y1: [0, 0, 0, 42], y2: [0, 0, 0, 22]}}
                          data={{
                            x: prescriberTradeItemTopView.prescriberNameList,
                            y1: prescriberTradeItemTopView.numList
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AuthWrapper>*/}


          <AuthWrapper functionName="f_home_recommendation_codes">
            <div className="item-recom">
              <div className="top-text"><FormattedMessage id="Home.RecommendationCodesUsage"/></div>
              <div className="item-recommendation-main space-between">
                <div className="recommendation-main flex-start">
                  <div className="recommendation-text">
                    <FormattedMessage id="Home.recommendation"/>
                  </div>
                  <div className="recommendation-num">
                    {p_prescriberRecommentCodeUseView && p_prescriberRecommentCodeUseView.activeCodeNumber != null ? <CountUp end={p_prescriberRecommentCodeUseView.activeCodeNumber} {...countUpProps} /> : '--'}
                  </div>
                </div>
                <div className="recommendation-main flex-start">
                  <div className="recommendation-text">
                    <FormattedMessage id="Home.NumberofCodesUsed"/>
                  </div>
                  <div className="recommendation-num">
                    {p_prescriberRecommentCodeUseView && p_prescriberRecommentCodeUseView.usedCodeNumber != null ? <CountUp end={p_prescriberRecommentCodeUseView.usedCodeNumber} {...countUpProps} /> : '--'}
                  </div>
                </div>
                <div className="recommendation-main flex-start">
                  <div className="recommendation-text">
                    <FormattedMessage id="Home.Numberofrecommendationcodes"/>
                  </div>
                  <div className="recommendation-num">
                    {p_prescriberRecommentCodeUseView && p_prescriberRecommentCodeUseView.orderModeCodeNumber != null ? <CountUp end={p_prescriberRecommentCodeUseView.orderModeCodeNumber} {...countUpProps} /> : '--'}
                  </div>
                </div>
              </div>
            </div>
          </AuthWrapper>
        </Spin>
      </div>
    );
  }
}
export default injectIntl(Prescriber);
