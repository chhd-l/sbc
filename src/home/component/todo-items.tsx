import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';

import { Spin } from 'antd';
//import { fromJS } from 'immutable';

import { cache, history, noop } from 'qmkit';
/*import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';*/
import PieChart from 'web_modules/biz/chart-pie/index.tsx';
import Funnel from 'web_modules/biz/funnel/funnel.tsx';
import BarLine from 'web_modules/biz/BarLine/index.tsx';
import CountUp from 'react-countup';
import nodataImg from '../images/no-data.jpg';
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
export default class TodoItems extends React.Component<any, any> {
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
      conversionFunnelDashboardView: ''
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
      transactionTrendView: any;
      trafficTrendDashboardView: any;
      conversionFunnelDashboardView: any;
      cleanRedux: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    tradeCustomerView: 'tradeCustomerView',
    goodsInfoTopView: 'goodsInfoTopView',
    prescriberTrendView: 'prescriberTrendView',
    prescriberTopView: 'prescriberTopView',
    trafficDashboardView: 'trafficDashboardView',
    transactionTrendView: 'transactionTrendView',
    trafficTrendDashboardView: 'trafficTrendDashboardView',
    conversionFunnelDashboardView: 'conversionFunnelDashboardView',
    cleanRedux: noop
  };

  componentWillUnmount() {
    const { cleanRedux } = this.props.relaxProps;
    cleanRedux();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { tradeCustomerView, goodsInfoTopView, prescriberTrendView, prescriberTopView, trafficDashboardView, transactionTrendView, trafficTrendDashboardView, conversionFunnelDashboardView } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    if (
      tradeCustomerView !== prevState.tradeCustomerView ||
      goodsInfoTopView !== prevState.goodsInfoTopView ||
      prescriberTrendView !== prevState.prescriberTrendView ||
      prescriberTopView !== prevState.prescriberTopView ||
      trafficDashboardView !== prevState.trafficDashboardView ||
      transactionTrendView !== prevState.transactionTrendView ||
      trafficTrendDashboardView !== prevState.trafficTrendDashboardView ||
      conversionFunnelDashboardView !== prevState.conversionFunnelDashboardView
    ) {
      return {
        tradeCustomerView,
        goodsInfoTopView,
        prescriberTrendView,
        prescriberTopView,
        trafficDashboardView,
        transactionTrendView,
        trafficTrendDashboardView,
        conversionFunnelDashboardView
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
    const { tradeCustomerView, goodsInfoTopView, prescriberTrendView, prescriberTopView, trafficDashboardView, transactionTrendView, trafficTrendDashboardView, conversionFunnelDashboardView } = this.state;

    return (
      <div className="item">
        <Spin spinning={loading} delay="500" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="item-top space-between">
            <div className="item-top-l flex-content">
              <div className="item-top-l-top">
                <div className="top-text">Overview</div>
                <div className="content space-between">
                  <div className="mode">
                    <div className="mode-text">Revenue</div>
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
                    <div className="mode-text">Average basket</div>
                    <div className="mode-num">
                      <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                      <span>{tradeCustomerView && tradeCustomerView.averageBasket != null ? <CountUp end={tradeCustomerView.averageBasket} decimals={2} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <img src={tradeCustomerView.averageBasketRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.averageBasketRate ? (tradeCustomerView.averageBasketRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.averageBasketRate != null ? <CountUp end={Math.abs(tradeCustomerView.averageBasketRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text">Conversion</div>
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
                  <div className="line"></div>
                  <div className="mode">
                    <div className="mode-text">Traffic</div>
                    <div className="mode-num">{tradeCustomerView && tradeCustomerView.traffic != null ? <CountUp end={tradeCustomerView.traffic} {...countUpProps} /> : '--'}</div>
                    <div className="mode-per">
                      {tradeCustomerView && tradeCustomerView.trafficRate != null ? <img src={tradeCustomerView.trafficRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={tradeCustomerView && tradeCustomerView.trafficRate != null ? (tradeCustomerView.trafficRate >= 0 ? 'green' : 'red') : ''}>
                        {tradeCustomerView && tradeCustomerView.trafficRate != null ? <CountUp end={Math.abs(tradeCustomerView.trafficRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-top-l-btm">
                <div className="top-text">Conversion Funnel</div>
                <div className="Funnel">
                  <Funnel data={conversionFunnelDashboardView && conversionFunnelDashboardView.dataList} />
                  <div className="Funnel-l">
                    <div className="Funnel-l-text">
                      <p>Landing page</p>
                      <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.dataList != null ? <CountUp end={conversionFunnelDashboardView.dataList[0]} {...countUpProps} /> : '--'}</p>
                      <p className="Funnel-l-dash1"></p>
                    </div>
                    <div className="Funnel-l-text">
                      <p>Shopping cart</p>
                      <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.dataList != null ? <CountUp end={conversionFunnelDashboardView.dataList[1]} {...countUpProps} /> : '--'}</p>
                      <p className="Funnel-l-dash2"></p>
                    </div>
                    <div className="Funnel-l-text">
                      <p>Checkout</p>
                      <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.dataList != null ? <CountUp end={conversionFunnelDashboardView.dataList[2]} {...countUpProps} /> : '--'}</p>
                      <p className="Funnel-l-dash3"></p>
                    </div>
                    <div className="Funnel-l-text">
                      <p>Payment</p>
                      <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.dataList != null ? <CountUp end={conversionFunnelDashboardView.dataList[3]} {...countUpProps} /> : '--'}</p>
                      <p className="Funnel-l-dash4"></p>
                    </div>
                  </div>
                  <div className="Funnel-r">
                    <div className="Funnel-r-top"></div>
                    <div className="Funnel-r-mid">
                      <div className="text1">Conversion rate</div>
                      <div className="text2">
                        {conversionFunnelDashboardView && conversionFunnelDashboardView.payLoginRate != null ? <CountUp end={conversionFunnelDashboardView.payLoginRate} decimals={2} {...countUpProps} /> : '--'}
                        <i>%</i>
                      </div>
                      <div className="text3">
                        {conversionFunnelDashboardView && conversionFunnelDashboardView.payLoginRateRate != null ? <img src={conversionFunnelDashboardView.payLoginRateRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={conversionFunnelDashboardView && conversionFunnelDashboardView.payLoginRateRate != null ? (conversionFunnelDashboardView.payLoginRateRate >= 0 ? 'green' : 'red') : ''}>
                          {conversionFunnelDashboardView && conversionFunnelDashboardView.payLoginRateRate != null ? <CountUp end={Math.abs(conversionFunnelDashboardView.payLoginRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>
                    </div>
                    <div className="Funnel-r-btm"></div>
                  </div>
                  <div className="Funnel-per1 flex-start-align">
                    <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.rateList[0] != null ? <CountUp end={conversionFunnelDashboardView.rateList[0]} decimals={2} {...countUpProps} /> : '--'}</p>
                    <p>%</p>
                  </div>
                  <div className="Funnel-per2 flex-start-align">
                    <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.rateList[1] != null ? <CountUp end={conversionFunnelDashboardView.rateList[1]} decimals={2} {...countUpProps} /> : '--'}</p>
                    <p>%</p>
                  </div>
                  <div className="Funnel-per3 flex-start-align">
                    <p>{conversionFunnelDashboardView && conversionFunnelDashboardView.rateList[2] != null ? <CountUp end={conversionFunnelDashboardView.rateList[2]} decimals={2} {...countUpProps} /> : '--'}</p>
                    <p>%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-m flex-content">
              <div className="item-top-m-top">
                <div className="top-text space-between">
                  <span>Traffic</span>
                  <span>
                    <Link to="/report-traffic">more &gt;</Link>
                  </span>
                </div>
                <div className="traffic space-between">
                  <div className="traffic-l">
                    <img
                      width="40"
                      height="40"
                      src="data:image/png;base64,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"
                      alt=""
                    />
                  </div>
                  <div className="traffic-r flex-content">
                    <div className="traffic-r-top flex-start">
                      <div className="mode">
                        <div className="mode-text">Page view</div>
                        <div className="mode-num">
                          <span>{trafficDashboardView && trafficDashboardView.pageView != null ? <CountUp end={trafficDashboardView.pageView} {...countUpProps} /> : '--'}</span>
                        </div>
                        <div className="mode-per">
                          {trafficDashboardView && trafficDashboardView.pageViewRate != null ? <img src={trafficDashboardView.pageViewRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={trafficDashboardView && trafficDashboardView.pageViewRate ? (trafficDashboardView.pageViewRate >= 0 ? 'green' : 'red') : ''}>
                            {trafficDashboardView && trafficDashboardView.pageViewRate != null ? <CountUp end={Math.abs(trafficDashboardView.pageViewRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                      <div className="mode">
                        {/* <div className="mode-text">Bounce rate</div>
                      <div className="mode-num">
                        <span> {trafficDashboardView && trafficDashboardView.bounceRate != null ? <CountUp end={trafficDashboardView.bounceRate} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</span>
                      </div>
                      <div className="mode-per">
                        {trafficDashboardView && trafficDashboardView.bounceRateRate != null ? <img src={trafficDashboardView.bounceRateRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                        <span className={trafficDashboardView && trafficDashboardView.bounceRateRate != null ? (trafficDashboardView.bounceRateRate >= 0 ? 'green' : 'red') : ''}>
                          {trafficDashboardView && trafficDashboardView.bounceRateRate != null ? <CountUp end={Math.abs(trafficDashboardView.bounceRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                        </span>
                      </div>*/}
                      </div>
                    </div>
                    <div className="traffic-r-btm flex-content">
                      <div className="mode">
                        <div className="mode-text">VET traffic</div>
                        <div className="mode-num">
                          <span> {trafficDashboardView && trafficDashboardView.vetTraffic != null ? <CountUp end={trafficDashboardView.vetTraffic} {...countUpProps} /> : '--'}</span>
                        </div>
                      </div>
                      <div className="line"></div>
                      <div className="mode">
                        <div className="mode-text">VET traffic rate</div>
                        <div className="mode-num num">
                          {/*<span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>*/}
                          <span> {trafficDashboardView && trafficDashboardView.vetTrafficRate != null ? <CountUp end={trafficDashboardView.vetTrafficRate} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-top-m-btm">
                <div className="top-text space-between">
                  <span>Transaction</span>
                  <span>
                    <Link to="/report-transaction">more &gt;</Link>
                  </span>
                </div>
                <div className="m-content flex-content">
                  <div className="transaction space-between">
                    <div className="transaction-l space-around">
                      <div className="text">Order Number</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.orderNumber != null ? <CountUp end={tradeCustomerView.orderNumber} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.orderNumberRate != null ? <img src={tradeCustomerView.orderNumberRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.orderNumberRate != null ? (tradeCustomerView.orderNumberRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.orderNumberRate != null ? <CountUp end={Math.abs(tradeCustomerView.orderNumberRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-l space-around">
                      <div className="text">Sales volume</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.salesVolume != null ? <CountUp end={tradeCustomerView.salesVolume} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? <img src={tradeCustomerView.salesVolumeRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? (tradeCustomerView.salesVolumeRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.salesVolumeRate != null ? <CountUp end={Math.abs(tradeCustomerView.salesVolumeRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="transaction space-between">
                    <div className="transaction-l space-around">
                      <div className="text">Units sold</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.unitsSold != null ? <CountUp end={tradeCustomerView.unitsSold} decimals={2} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? <img src={tradeCustomerView.unitsSoldRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? (tradeCustomerView.unitsSoldRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.unitsSoldRate != null ? <CountUp end={Math.abs(tradeCustomerView.unitsSoldRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-l space-around">
                      <div className="text">Retention rate</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.retentionRate != null ? <CountUp end={tradeCustomerView.retentionRate} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.retentionRateRate != null ? <img src={tradeCustomerView.retentionRateRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.retentionRateRate != null ? (tradeCustomerView.retentionRateRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.retentionRateRate != null ? <CountUp end={Math.abs(tradeCustomerView.retentionRateRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-r flex-content">
              <div className="item-top-r-top">
                <div className="top-text">Consumer</div>
                <div className="consumer flex-content">
                  <div className="consumer-top flex-start">
                    <div className="mode">
                      <div className="mode-text">Active consumers</div>
                      <div className="mode-num">
                        {/*<span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>*/}
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
                      <div className="mode-text">Active consumer rate</div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.activeConsumerRate != null ? <CountUp end={tradeCustomerView.activeConsumerRate} suffix={'%'} decimals={2} {...countUpProps} /> : '--'}</span>
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
                      <div className="mode-text">Total consumers</div>
                      <div className="mode-num">
                        <span>{tradeCustomerView && tradeCustomerView.totalConsumers != null ? <CountUp end={tradeCustomerView.totalConsumers} {...countUpProps} /> : '--'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-top-r-btm">
                <div className="top-text">Subscription</div>
                <div className="subscription space-between">
                  <div className="subscription-l">
                    <PieChart total="100" shelves={tradeCustomerView && tradeCustomerView.subscriptionRate != null ? tradeCustomerView.subscriptionRate : 0} />
                  </div>
                  <div className="subscription-r flex-content">
                    <div className="subscription-content space-around">
                      <div className="text">Order Number</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.subscriptionNumber != null ? <CountUp end={tradeCustomerView.subscriptionNumber} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
                          {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <img src={tradeCustomerView.subscriptionNumberRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                          <span className={tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? (tradeCustomerView.subscriptionNumberRate >= 0 ? 'green' : 'red') : ''}>
                            {tradeCustomerView && tradeCustomerView.subscriptionNumberRate != null ? <CountUp end={Math.abs(tradeCustomerView.subscriptionNumberRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="subscription-content space-around">
                      <div className="text">Sales volume</div>
                      <div className="num">
                        <div className="num-l">{tradeCustomerView && tradeCustomerView.subscriptionRevenue != null ? <CountUp end={tradeCustomerView.subscriptionRevenue} {...countUpProps} /> : '--'}</div>
                        <div className="num-r">
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
            </div>
          </div>
          <div className="item-mid space-between">
            <div className="item-mid-l">
              <div className="top-text">Prescriber</div>
              <div className="prescriber space-between">
                <div className="item-mid-l-l flex-content">
                  <div className="mode mid-l-l-content">
                    <div className="mode-text">Active prescriber rates</div>
                    <div className="mode-num">{prescriberTopView && prescriberTopView.activePrescriberRates != null ? <CountUp end={prescriberTopView.activePrescriberRates} suffix={'%'} decimals={2} {...countUpProps} /> : '--'}</div>
                    <div className="mode-per">
                      {prescriberTopView && prescriberTopView.activePrescriberRatesRate != null ? <img src={prescriberTopView.activePrescriberRatesRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={prescriberTopView && tradeCustomerView.activePrescriberRatesRate != null ? (prescriberTopView.activePrescriberRatesRate >= 0 ? 'green' : 'red') : ''}>
                        {prescriberTopView && prescriberTopView.activePrescriberRatesRate != null ? <CountUp end={Math.abs(prescriberTopView.activePrescriberRatesRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="line-1 mode-line"></div>
                  <div className="mode mid-l-l-content">
                    <div className="mode-text">Active prescribers</div>
                    <div className="mode-num">{prescriberTopView && prescriberTopView.activePrescribers != null ? <CountUp end={prescriberTopView.activePrescribers} {...countUpProps} /> : '--'}</div>
                    <div className="mode-per">
                      {prescriberTopView && prescriberTopView.activePrescribersRate != null ? <img src={prescriberTopView.activePrescribersRate >= 0 ? icon1 : icon2} width="14" height="14" /> : ''}
                      <span className={prescriberTopView && tradeCustomerView.activePrescribersRate != null ? (prescriberTopView.activePrescribersRate >= 0 ? 'green' : 'red') : ''}>
                        {prescriberTopView && prescriberTopView.activePrescribersRate != null ? <CountUp end={Math.abs(prescriberTopView.activePrescribersRate)} decimals={2} suffix={'%'} {...countUpProps} /> : '--'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="item-mid-l-r">
                  <div className="r-text">Prescriber reward Top 3</div>
                  <div className="r-content">
                    {prescriberTopView && prescriberTopView.prescriberDashboardViewItemList && prescriberTopView.prescriberDashboardViewItemList.length != 0 ? (
                      prescriberTopView.prescriberDashboardViewItemList.map((item, i) => {
                        return (
                          <React.Fragment key={i}>
                            <div className="r-content-list space-between-align">
                              <p>{i + 1}</p>
                              <p>{item.prescriberName ? item.prescriberName : '--'}</p>
                              <p>
                                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + ' '} {item.rewardAmount ? <CountUp end={item.rewardAmount} {...countUpProps} /> : '--'}
                              </p>
                              <p>{item.orderNum ? <CountUp end={item.orderNum} {...countUpProps} /> : '--'} order</p>
                            </div>
                            <div className="line-1 r-content-line"></div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <span className="data-img" style={{ width: '100%', textAlign: 'right', float: 'right', paddingTop: '55px' }}>
                        <img src={nodataImg} className="no-data-img" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="item-mid-r">
              <div className="top-text">
                <div className="top-text space-between">
                  <span>Best seller</span>
                  <span>
                    <Link to="/report-product">more &gt;</Link>
                  </span>
                </div>
              </div>
              {goodsInfoTopView && goodsInfoTopView.length === 0 ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img" />
                </div>
              ) : (
                <div className="seller space-between">
                  {goodsInfoTopView &&
                    goodsInfoTopView.map((item, i) => {
                      return (
                        <div className="seller-pro flex-start" key={i}>
                          <div className="text">TOP {i + 1}</div>
                          <div className="seller-content flex-content-start">
                            <img src={item.goodsInfoImg} alt="" />
                            <div className="content-text1 font-line1">{item.goodsInfoName}</div>
                            <div className="content-text2">{item.marketPrice + ' ' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</div>
                            <div className="content-text3">{item.salesVolume + ' units'}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="item-btm space-between">
            <div className="item-btm-l">
              <div className="top-text">
                <div className="top-text space-between">
                  <span>Traffic Trend</span>
                  <span>
                    <Link to="/report-traffic">more &gt;</Link>
                  </span>
                </div>
              </div>

              {!trafficTrendDashboardView || (trafficTrendDashboardView.weekNumList.length === 0 && trafficTrendDashboardView.totalPVList.length === 0 && trafficTrendDashboardView.conversionRateList.length === 0) ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img" />
                </div>
              ) : (
                <div className="line">
                  <BarLine
                    yName={{ y1: 'Traffic', y2: 'Conversion rate' }}
                    unit={{ unit1: '', unit2: '%' }}
                    nameTextStyle={{ y1: [0, 20, 0, 0], y2: [0, 16, 0, 0] }}
                    data={{
                      x: trafficTrendDashboardView.weekNumList,
                      y1: trafficTrendDashboardView.totalPVList,
                      y2: trafficTrendDashboardView.conversionRateList
                    }}
                  />
                </div>
              )}
            </div>
            <div className="item-btm-m">
              <div className="top-text">Prescribers Trend</div>
              {!prescriberTrendView || (prescriberTrendView.weekNumList.length === 0 && prescriberTrendView.reward.length === 0 && prescriberTrendView.activeRate.length === 0) ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img" />
                </div>
              ) : (
                <div className="line">
                  {prescriberTrendView && (
                    <BarLine
                      yName={{ y1: 'Prescriber reward', y2: 'Active rate' }}
                      unit={{ unit1: '', unit2: '%' }}
                      nameTextStyle={{ y1: [0, 0, 0, 42], y2: [0, 0, 0, 22] }}
                      data={{
                        x: prescriberTrendView.weekNumList,
                        y1: prescriberTrendView.reward,
                        y2: prescriberTrendView.activeRate
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="item-btm-r">
              <div className="top-text space-between">
                <span>Transaction Trend</span>
                <span>
                  <Link to="/report-transaction">more &gt;</Link>
                </span>
              </div>
              {!transactionTrendView || (transactionTrendView.weekNumList.length === 0 && transactionTrendView.revenueList.length === 0 && transactionTrendView.transactionList.length === 0) ? (
                <div className="data-img">
                  <img src={nodataImg} className="no-data-img" />
                </div>
              ) : (
                <div className="line">
                  {transactionTrendView && (
                    <BarLine
                      yName={{ y1: 'Revenue', y2: 'Transaction' }}
                      unit={{ unit1: '', unit2: '' }}
                      nameTextStyle={{ y1: [0, 52, 0, 0], y2: [0, 22, 0, 0] }}
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
