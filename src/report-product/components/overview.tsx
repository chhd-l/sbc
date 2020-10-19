import React, { Component } from 'react';
import { Const } from 'qmkit';
import { Form, Rate, DatePicker, Spin, Button } from 'antd';
import '../index.less';
const { RangePicker } = DatePicker;
import * as webapi from '../webapi';

const icon1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAD50lEQVRYCcVYMW8dRRCemV2fsRNQkBwUp0iCRAUFSgAJCiQkIBFOQDRQ8QcQHR0VLiiiSBSRCFUEBSKWiJSCEEcBOoTcABFCVFShSBoLmYBf/O7d7jDfhb3cO9+99yzb8pOs3Zmdme+7udndOTNt4ffW719lvTC7Ly+yGY19P63s86Aucxz6rAXLdJH5/N6s661ffurtfNLQPM5QVfnVn79/JJP8wCCP2Tj7tD5lDma+9t0zr9xlZk36tnEkiZO/3tjnQzG3FfAmCMgUzq9++/Sp9eZakltJ4OkXfrg+V2ThQDLc7uhzt7b84murbVnZRGJRVX5a+Wa+LzS7XeCm/3Sk3rMvnLmzyBzra1IXkIHdIgAcPBjiA6eOO0QCr2A3MlAHRHzg1HUVIxSh3ssP1xc3zUN8XSke26RvUzD3if0N2xi3WpdnstupWD0MkJ7TN5fnBm3WSQcCGj9O4thRbVdK8U7k7GWhsCk0dp3h9lCo5evAObCdbdhJKOohKcKxtnXgARdrZSbKg6jNsq5zcpWDZW2S16F0xlwfv+8e7BW7P+qh0hy4Nv/b4yhe+2fCkxBEaKiWU7xy1EjPeeZ/BzGfZ+WSRBSd7/JANoDvcRfg+bbzsxNRXN4/a8X1ZmGBhN2SZawMaW98flRs4NuZms2MMhq3ZjXtjcB5EEi2kflumhPFkTsO+ILb8IHD1mby0FRGWnxqBE4lT2ZZcqwrD2QemQngC67j5LCVUZhmw/rGRYr6UuXH9Bk5+dDOh9uVLtJIEsAX9AOVw4QT8fRwKIrPLQPPJxclvsDOny3l4O9UetZDkY1yxw/4goakY71VLbF4tNgovrBaPp4MmOmceHc+yWpFYvO/SllpKsbiYFprjsAXdETNhS7ZHuhgiPylPdaTpQ2aFZZFcv5i08cWqmwId+8Q4Nv69GQkoh6O+WDJtvMTADQiwf4+YCeXmgQgC3NVF6zaWRfAF/SEbUHqOtuGRykGI0BHSj3TIDr/Pjl3pW43NGeaiATwBU3pkHNDUOf22/1zyY6z+0+j1Hfi37NSu94wHRaVfqsUSqvVvDEBflm1C79cO9p5gcVwUqN+Al+78XrWjrzL4lYasdrFEN+wBbVte7XNAP3n8onTt8ozAl0x08ZjbYbkp36kQb7CxPtV5CMjcrPVrk3p5Os2ddIBF/MyE//3E0c6s5G8dnBEFq4dX/iz6icwQVu+gxhjQwEPuDCsblm0WmjLx3rvgAFwUms3RAICvgvQlu8ATmcIxAdO3aDKBJRID74LdosI4iJ+eg2JSFmYSUgjCnVPv8ASEYx7+i1aJ4Ks7OlXeZ0M5rv1/4n/ANnU1qrBziWWAAAAAElFTkSuQmCC';
const icon2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAEEklEQVRYCcVYO2wcRRie167vkVzsJA62Y4STQGUFYUBIESIFCBBIgECiMKEBuUIIpQqUpkoT6KgRdYQoaHgICUFDgTBCCkg4ds7GvgTFUiI/7rE7O5P51vznvfWuLxds55p//sf837fz7878c5z18Lsy/qZ/XNTLqyooqsCqUDAldCCN8iPPMK19rivabyyb0sb4lcvB3abm3QKttXz+yecrRWP6o6b2u8WTXxZU0BDi9slfv1/lnFuyZ8kdSdx49IWykfpoL+BpEJARkVoZ+uO7jbSP9EwSePqrj589Wmjyfgr8v7JZsLcf/u2nlaxVEenkdnpaLD323MhuEgAG8iEv8qcxO1YCK4BAFuhSOnDXdF/VR3//oZZckQ5WKMGeEsCTuAeMcRJP1SaBl3C3S5DA6RgCB3hkjEmgDPgKyLgfEnjABVZMAvtA3mfY12iUzez8F3Z27kteq03sFkHgAbdNAhtRXvJw5dbTzJgz1tjTZq3+OV9ePpMXm7bz6j+v8urSK2k76YQrsRX74doRcqSl78l/o9W1N5wdNfRsEL2smo2/bKVSTccmdRCIWq1LNtIvivV6lfVX/k76MbbayKkHnloXOAvSzqTeKpXW5eCht1zlrm/abV+40fzMVBdfSsalxybSp8lmbP77BnyBw4iC86Q5PLggjg1McsYXN2Osx1vBp44IVij7Z8wIObjy/nsAsmxJ4AuchlumHUYDAzU5NDjJGL+KKHciSUfkIru26FZp+88yu0VCqlwSwBc4jrenyLaYQ5WbYmT4HBPiT0Q4ItwEwTSbX5zaNsOwYbJF5WIuibgdQD9AwXclD5ZuFY8Pve2IzFC8CYMLdn7hA9JtUO9z48ObOg9l5cBN8qUl8AUakrSjmx6/rA+OvMOF+IVibRi+b+cWPoIu1zbaq+B2oxuWi9x+AvgCHREl6kXaQqHujQ1POSI/0jyrw3fZ3LWPdSPYeh8Ezy0F5gFfoCWjJL1K7RUDdWL0PSvENzTX6GiSB2F7QzNdSABfoCekBPciI+Vr79RD54WSX9F8bmy8HUPnXNTIniWBL9CUZjl7sRkhDTt14kNxoHxOVQ6+Zjj3aL7htMmRpVMCX6Errk08G+QdYMkpOAciE40lbemxgUGbJ8guPZn7TqD/HJ+5HMR7BLpi10Yfo4lZMibQan6S5dvRprzccgAXc+OjHG05WO2Y7B6c+DzVkeyDDnjARdp4JdDvuU5nJWK6/WmlMe3Y6NeyusS6lYPmOQIt2V/6Vnt9IdmSEtcA6jPjzoacsxPPDO5Hi4f2/5GZn9u7aFwOIoF7AXPdMOl7Il3+GCeRvIMElmf09bPX94wI2n2Xn8pAPDrKQcb9voFlkiAy9/UuSiQgsSr39VaeJIPxXv0/cQeTu+OSeUihNAAAAABJRU5ErkJggg==';

export default class ProductOverView extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      beginTime: '',
      endTime: '',
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

  componentDidMount() {
    const mock = [
      {
        goodsName: 'MINI PUPPY',
        linePrice: 2692,
        goodsWeight: '85',
        goodsUnit: 'units',
        goodsRate: 5,
        goodsEvaluateNum: 30,
        goodsImg: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202007280743135522.png'
      },
      {
        goodsName: 'MINI PUPPY1',
        linePrice: 2300,
        goodsWeight: '81',
        goodsUnit: 'units',
        goodsRate: 5,
        goodsEvaluateNum: 30,
        goodsImg: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202007280743135522.png'
      },
      {
        goodsName: 'MINI PUPPY1',
        linePrice: 2300,
        goodsWeight: '81',
        goodsUnit: 'units',
        goodsRate: 5,
        goodsEvaluateNum: 30,
        goodsImg: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202007280743135522.png'
      },
      {
        goodsName: 'MINI PUPPY1',
        linePrice: 2300,
        goodsWeight: '81',
        goodsUnit: 'units',
        goodsRate: 5,
        goodsEvaluateNum: 30,
        goodsImg: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202007280743135522.png'
      },
      {
        goodsName: 'MINI PUPPY1',
        linePrice: 2300,
        goodsWeight: '81',
        goodsUnit: 'units',
        goodsRate: 4,
        goodsEvaluateNum: 22,
        goodsImg: 'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202007280743135522.png'
      }
    ];
    this.setState({
      bestSellers: mock,
      highPraiseProducts: mock
    });
    this.getOverviewInfo();
  }

  getOverviewInfo(params = {}) {
    this.setState({
      loading: true
    });
    webapi.getOverview(params).then((res) => {
      this.setState({
        loading: false
      });
    });
  }
  datePickerChange(e) {
    let beginTime = '';
    let endTime = '';
    if (e.length > 0) {
      beginTime = e[0].format(Const.DAY_FORMAT);
      endTime = e[1].format(Const.DAY_FORMAT);
    }
    this.setState({
      beginTime,
      endTime
    });
    debugger;
  }
  onSearch() {
    const { beginTime, endTime } = this.state;
    const params = {
      beginTime,
      endTime
    };
    console.log(params, 'overview params');
    this.getOverviewInfo(params);
  }
  render() {
    const { loading, overview, bestSellers, highPraiseProducts } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="container">
          <div className="list-head-container">
            <h4>Product</h4>
            <div>
              <Form layout="inline">
                <Form.Item>
                  <RangePicker size="default" onChange={(e) => this.datePickerChange(e)} />
                </Form.Item>
                <Button type="primary" shape="round" onClick={() => this.onSearch()}>
                  Search
                </Button>
              </Form>
            </div>
          </div>
          <div className="head-container row-flex">
            <div className="overviewContainer">
              <h4>Overview</h4>
              <div className="data-statistics">
                <div className="mode">
                  <div className="mode-text">On shelf SKU</div>
                  <div className="mode-num">
                    <span> {overview && overview.onShelfSkuValue ? overview.onShelfSkuValue : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {overview && overview.onShelfSkuRate ? (
                      <>
                        <img src={overview.onShelfSkuRate >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{overview.onShelfSkuRate}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="mode">
                  <div className="mode-text">Total SKU</div>
                  <div className="mode-num">
                    <span> {overview && overview.totalSkuValue ? overview.totalSkuValue : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {overview && overview.totalSkuRate ? (
                      <>
                        <img src={overview.totalSkuRate >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{overview.totalSkuRate}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4>Logistics</h4>
              <div className="data-statistics">
                <div className="mode">
                  <div className="mode-text">Logistics rating</div>
                  <div className="mode-num">
                    <span> {overview && overview.logisticsRatingValue ? overview.logisticsRatingValue : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {overview && overview.logisticsRatingRate ? (
                      <>
                        <img src={overview.logisticsRatingRate >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{overview.logisticsRatingRate}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="mode">
                  <div className="mode-text">OTIF</div>
                  <div className="mode-num">
                    <span> {overview && overview.otifValue ? overview.otifValue : '--'}</span>
                  </div>
                  <div className="mode-per">
                    {overview && overview.otifRate ? (
                      <>
                        <img src={overview.otifRate >= 0 ? icon1 : icon2} width="14" height="14" />
                        <span>{overview.otifRate}</span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="head-container mgt20 mgb20">
            <h4>Best sellers</h4>
            <div className="row-flex mgt20">
              {bestSellers.map((item, index) => {
                return (
                  <div className="sellers-container row-flex" key={index}>
                    <div>
                      <img src={item.goodsImg} />
                    </div>
                    <div className="column-flex goods-container">
                      <div className="column-flex goods-info">
                        <span className="rank">TOP{index + 1}</span>
                        <span className="goodsName">{item.goodsName}</span>
                        <span className="price">{item.linePrice}</span>
                        <span className="price">
                          {item.goodsWeight} {item.goodsUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="head-container mgt20 mgb20">
            <h4 className="title">High praise products</h4>
            <div className="row-flex mgt20">
              {highPraiseProducts.map((item, index) => {
                return (
                  <div className="sellers-container row-flex" key={index}>
                    <div>
                      <img src={item.goodsImg} />
                    </div>
                    <div className="column-flex goods-container">
                      <div className="column-flex goods-info">
                        <span className="rank">TOP{index + 1}</span>
                        <span className="goodsName">{item.goodsName}</span>
                        <span className="price">{item.linePrice}</span>
                        <div>
                          <Rate value={item.goodsRate} className="RedRate" disabled={true} />
                          <span className="price">({item.goodsEvaluateNum})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
const styles = {} as any;
