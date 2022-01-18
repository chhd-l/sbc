import React, { Component } from 'react';
import { cache, Const, noop, util } from 'qmkit';
import { Form, Rate, DatePicker, Spin, Button } from 'antd';
import '../index.less';
const { RangePicker } = DatePicker;
import * as webapi from '../webapi';
import { Relax } from 'plume2';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
const icon1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAD50lEQVRYCcVYMW8dRRCemV2fsRNQkBwUp0iCRAUFSgAJCiQkIBFOQDRQ8QcQHR0VLiiiSBSRCFUEBSKWiJSCEEcBOoTcABFCVFShSBoLmYBf/O7d7jDfhb3cO9+99yzb8pOs3Zmdme+7udndOTNt4ffW719lvTC7Ly+yGY19P63s86Aucxz6rAXLdJH5/N6s661ffurtfNLQPM5QVfnVn79/JJP8wCCP2Tj7tD5lDma+9t0zr9xlZk36tnEkiZO/3tjnQzG3FfAmCMgUzq9++/Sp9eZakltJ4OkXfrg+V2ThQDLc7uhzt7b84murbVnZRGJRVX5a+Wa+LzS7XeCm/3Sk3rMvnLmzyBzra1IXkIHdIgAcPBjiA6eOO0QCr2A3MlAHRHzg1HUVIxSh3ssP1xc3zUN8XSke26RvUzD3if0N2xi3WpdnstupWD0MkJ7TN5fnBm3WSQcCGj9O4thRbVdK8U7k7GWhsCk0dp3h9lCo5evAObCdbdhJKOohKcKxtnXgARdrZSbKg6jNsq5zcpWDZW2S16F0xlwfv+8e7BW7P+qh0hy4Nv/b4yhe+2fCkxBEaKiWU7xy1EjPeeZ/BzGfZ+WSRBSd7/JANoDvcRfg+bbzsxNRXN4/a8X1ZmGBhN2SZawMaW98flRs4NuZms2MMhq3ZjXtjcB5EEi2kflumhPFkTsO+ILb8IHD1mby0FRGWnxqBE4lT2ZZcqwrD2QemQngC67j5LCVUZhmw/rGRYr6UuXH9Bk5+dDOh9uVLtJIEsAX9AOVw4QT8fRwKIrPLQPPJxclvsDOny3l4O9UetZDkY1yxw/4goakY71VLbF4tNgovrBaPp4MmOmceHc+yWpFYvO/SllpKsbiYFprjsAXdETNhS7ZHuhgiPylPdaTpQ2aFZZFcv5i08cWqmwId+8Q4Nv69GQkoh6O+WDJtvMTADQiwf4+YCeXmgQgC3NVF6zaWRfAF/SEbUHqOtuGRykGI0BHSj3TIDr/Pjl3pW43NGeaiATwBU3pkHNDUOf22/1zyY6z+0+j1Hfi37NSu94wHRaVfqsUSqvVvDEBflm1C79cO9p5gcVwUqN+Al+78XrWjrzL4lYasdrFEN+wBbVte7XNAP3n8onTt8ozAl0x08ZjbYbkp36kQb7CxPtV5CMjcrPVrk3p5Os2ddIBF/MyE//3E0c6s5G8dnBEFq4dX/iz6icwQVu+gxhjQwEPuDCsblm0WmjLx3rvgAFwUms3RAICvgvQlu8ATmcIxAdO3aDKBJRID74LdosI4iJ+eg2JSFmYSUgjCnVPv8ASEYx7+i1aJ4Ks7OlXeZ0M5rv1/4n/ANnU1qrBziWWAAAAAElFTkSuQmCC';
const icon2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAEEklEQVRYCcVYO2wcRRie167vkVzsJA62Y4STQGUFYUBIESIFCBBIgECiMKEBuUIIpQqUpkoT6KgRdYQoaHgICUFDgTBCCkg4ds7GvgTFUiI/7rE7O5P51vznvfWuLxds55p//sf837fz7878c5z18Lsy/qZ/XNTLqyooqsCqUDAldCCN8iPPMK19rivabyyb0sb4lcvB3abm3QKttXz+yecrRWP6o6b2u8WTXxZU0BDi9slfv1/lnFuyZ8kdSdx49IWykfpoL+BpEJARkVoZ+uO7jbSP9EwSePqrj589Wmjyfgr8v7JZsLcf/u2nlaxVEenkdnpaLD323MhuEgAG8iEv8qcxO1YCK4BAFuhSOnDXdF/VR3//oZZckQ5WKMGeEsCTuAeMcRJP1SaBl3C3S5DA6RgCB3hkjEmgDPgKyLgfEnjABVZMAvtA3mfY12iUzez8F3Z27kteq03sFkHgAbdNAhtRXvJw5dbTzJgz1tjTZq3+OV9ePpMXm7bz6j+v8urSK2k76YQrsRX74doRcqSl78l/o9W1N5wdNfRsEL2smo2/bKVSTccmdRCIWq1LNtIvivV6lfVX/k76MbbayKkHnloXOAvSzqTeKpXW5eCht1zlrm/abV+40fzMVBdfSsalxybSp8lmbP77BnyBw4iC86Q5PLggjg1McsYXN2Osx1vBp44IVij7Z8wIObjy/nsAsmxJ4AuchlumHUYDAzU5NDjJGL+KKHciSUfkIru26FZp+88yu0VCqlwSwBc4jrenyLaYQ5WbYmT4HBPiT0Q4ItwEwTSbX5zaNsOwYbJF5WIuibgdQD9AwXclD5ZuFY8Pve2IzFC8CYMLdn7hA9JtUO9z48ObOg9l5cBN8qUl8AUakrSjmx6/rA+OvMOF+IVibRi+b+cWPoIu1zbaq+B2oxuWi9x+AvgCHREl6kXaQqHujQ1POSI/0jyrw3fZ3LWPdSPYeh8Ezy0F5gFfoCWjJL1K7RUDdWL0PSvENzTX6GiSB2F7QzNdSABfoCekBPciI+Vr79RD54WSX9F8bmy8HUPnXNTIniWBL9CUZjl7sRkhDTt14kNxoHxOVQ6+Zjj3aL7htMmRpVMCX6Errk08G+QdYMkpOAciE40lbemxgUGbJ8guPZn7TqD/HJ+5HMR7BLpi10Yfo4lZMibQan6S5dvRprzccgAXc+OjHG05WO2Y7B6c+DzVkeyDDnjARdp4JdDvuU5nJWK6/WmlMe3Y6NeyusS6lYPmOQIt2V/6Vnt9IdmSEtcA6jPjzoacsxPPDO5Hi4f2/5GZn9u7aFwOIoF7AXPdMOl7Il3+GCeRvIMElmf09bPX94wI2n2Xn8pAPDrKQcb9voFlkiAy9/UuSiQgsSr39VaeJIPxXv0/cQeTu+OSeUihNAAAAABJRU5ErkJggg==';
import nodataImg from '/web_modules/qmkit/images/sys/no-data.jpg';
@Relax
export default class ProductOverView extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {

      overview: {
        onShelfSkuValue: 130,
        onShelfSkuRate: -3.2,
        totalSkuValue: 136,
        totalSkuRate: 3.1,
        logisticsRatingValue: 8.7,
        logisticsRatingRate: -3.2,
        otifValue: '96.5%',
        otifRate: -3.6
      },
      bestSellers: [],
      highPraiseProducts: []
    };
  }
  props: {
    relaxProps?: {
      loading: boolean;
      productStatistics: any;
      beginDate: '',
      endDate: '',
      onProductStatistics: Function;
      onProductReportPage: Function;
      getDate: any;
      fieldOnChange: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    productStatistics: 'productStatistics',
    onProductStatistics: noop,
    onProductReportPage: noop,
    getDate: 'getDate',
    beginDate: 'beginDate',
    endDate: 'endDate',
    fieldOnChange: noop,
  };
  componentDidMount() {
    //   this.setState({
    //     beginDate: moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'),
    //   endDate: moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD').format('YYYY-MM-DD')
    // });
  }

  getOverviewInfo(params = {}) {
    this.setState({
      //loading: true
    });
  }
  datePickerChange(e) {
    const { fieldOnChange } = this.props.relaxProps
    let beginTime = '';
    let endTime = '';
    if (e.length > 0) {
      beginTime = e[0].format(Const.DAY_FORMAT);
      endTime = e[1].format(Const.DAY_FORMAT);
    }
    // this.setState({
    //   beginDate: beginTime,
    //   endDate: endTime
    // });
    fieldOnChange({
      field: 'beginDate',
      value: beginTime
    })
    fieldOnChange({
      field: 'endDate',
      value: endTime
    })
  }
  dateCalculate = (n) => {
    let date = new Date(sessionStorage.getItem('defaultLocalDateTime'));
    return date.setDate(date.getDate() - n);
  };
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }
  onSearch() {
    const { onProductStatistics, onProductReportPage } = this.props.relaxProps;
    // const { beginDate, endDate } = this.state;
    // const params1 = {
    //   beginDate,
    //   endDate
    // };
    // const params2 = {
    //   beginDate,
    //   endDate,
    //   sortName: 'revenue',
    //   pageSize: 10,
    //   pageNum: 1
    // };
    onProductStatistics();
    onProductReportPage();
  }
  render() {
    const { productStatistics, beginDate } = this.props.relaxProps;
    let loadinga = false;
    return (
      <Spin spinning={loadinga}>
        <div className="container statistics">
          <div className="list-head-container">
            <h4>
              <FormattedMessage id="Analysis.Product" />
            </h4>
            <div>
              <Form layout="inline">
                <Form.Item>
                  <RangePicker
                    onChange={(e) => this.datePickerChange(e)}
                    disabledDate={this.disabledDate}
                    defaultValue={[moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD').subtract(7, 'days'), moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD')]}
                    format={'YYYY-MM-DD'}
                  />
                </Form.Item>
                <Button type="primary" style={{ marginTop: '5px' }} shape="round" onClick={() => this.onSearch()}>
                  <FormattedMessage id="Analysis.Search" />
                </Button>
              </Form>
            </div>
          </div>
          <div className="head-container row-flex">
            <div className="overviewContainer">
              <h4>
                <FormattedMessage id="Analysis.Overview" />
              </h4>
              <div className="data-statistics">
                <div className="mode">
                  <div className="mode-text">
                    <FormattedMessage id="Analysis.OnShelfSKU" />
                  </div>
                  <div className="mode-num">
                    <span> {productStatistics && productStatistics.onShelfSkuNum ? productStatistics.onShelfSkuNum : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {productStatistics && productStatistics.onShelfSkuNumQoQ ? (
                      <>
                        <img src={productStatistics.onShelfSkuNumQoQ >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{productStatistics.onShelfSkuNumQoQ}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="mode">
                  <div className="mode-text">
                    <FormattedMessage id="Analysis.TotalSKU" />
                  </div>
                  <div className="mode-num">
                    <span> {productStatistics && productStatistics.totalSkuNum ? productStatistics.totalSkuNum : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {productStatistics && productStatistics.totalSkuNumQoQ ? (
                      <>
                        <img src={productStatistics.totalSkuNumQoQ >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{productStatistics.totalSkuNumQoQ}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="mode">
                  <div className="mode-text">
                    <FormattedMessage id="Analysis.ProductRating" />
                  </div>
                  <div className="mode-num">
                    <span> {productStatistics && productStatistics.skuRating ? productStatistics.skuRating : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {productStatistics && productStatistics.skuRatingQoQ ? (
                      <>
                        <img src={productStatistics.skuRatingQoQ >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{productStatistics.skuRatingQoQ}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4> </h4>
              <div className="data-statistics"></div>
            </div>
          </div>
          <div className="head-container mgt20 mgb20">
            <h4>
              <FormattedMessage id="Analysis.BestSellers" />
            </h4>
            <div className="row-flex mgt20">
              {productStatistics.salesVolumeTopProduct &&
                productStatistics.salesVolumeTopProduct.map((item, index) => {
                  return (
                    <div className="sellers-container row-flex" key={index}>
                      <div>
                        <img src={util.optimizeImage(item.skuImg)} />
                      </div>
                      <div className="column-flex goods-container">
                        <div className="column-flex goods-info">
                          <span className="rank">
                            <FormattedMessage id="Analysis.TOP" />
                            {item.topNum}
                          </span>
                          <p className="goodsName" title={item.skuName} style={styles.ellipsis}>{item.skuName}</p>
                          <span className="price">
                            {item.marketPrice ? item.marketPrice : '--'} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </span>
                          <span className="price">{item.salesVolume ? item.salesVolume : '--'} units</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="head-container mgt20 mgb20">
            <h4 className="title">
              <FormattedMessage id="Analysis.HighPraiseProducts" />
            </h4>
            <div className="row-flex mgt20">
              {productStatistics && productStatistics.evaluationTopProduct.length != 0 ? (
                productStatistics.evaluationTopProduct.map((item, index) => {
                  return (
                    <div className="sellers-container row-flex" key={item.topNum}>
                      <div>
                        <img src={util.optimizeImage(item.skuImg)} />
                      </div>
                      <div className="column-flex goods-container">
                        <div className="column-flex goods-info">
                          <span className="rank">TOP{item.topNum}</span>
                          <span className="goodsName" title={item.skuName} style={styles.ellipsis}>{item.skuName}</span>
                          <span className="price">
                            {item.marketPrice} {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </span>
                          <div>
                            <Rate value={item.marketPrice} className="RedRate" disabled={true} />
                            <span className="price">({item.averageScore})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span style={{ width: '100%', textAlign: 'center', paddingTop: '30px' }}>
                  <img src={nodataImg} width="80" className="no-data-img" />
                </span>
              )}
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
const styles = {
  ellipsis: {
    overflow: 'hidden', //超出的文本隐藏
    textOverflow: 'ellipsis',//溢出用省略号显示
    whiteSpace: 'nowrap', //溢出不换行
    width:80,
  }
} as any;
