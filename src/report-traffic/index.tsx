import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CountUp from 'react-countup';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
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

export default class ProductReport extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Traffic',
      loading: false,
      overviewList: [
        {
          name: 'Traffic',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'Page view',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'Average site visit duration',
          value: 4524,
          rate: -3.2
        },
        {
          name: 'Bounce rate',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'Active visitor rate',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'Return visitor rate',
          value: 4524,
          rate: -3.2
        }
      ],
      productTrafficList: [
        {
          name: 'Product visitors',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'Product view',
          value: 4524,
          rate: -3.2
        }
      ],
      trafficSourceList: [
        {
          name: 'Traffic through paid media',
          value: 4524,
          rate: 3.2
        },
        {
          name: 'VET traffic',
          value: 4524,
          rate: -3.2
        }
      ]
    };
  }
  componentDidMount() {}

  render() {
    const { title, overviewList, productTrafficList, trafficSourceList } = this.state;

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline
            title={title}
            extra={
              <div>
                <RangePicker defaultValue={[moment(new Date(sessionStorage.getItem('defaultLocalDateTime')), 'YYYY-MM-DD'), moment(new Date(sessionStorage.getItem('defaultLocalDateTime')), 'YYYY-MM-DD')]} format={'YYYY-MM-DD'} />
              </div>
            }
          />
          <div>
            <h4>Overview</h4>
            <div className="data-statistics">
              {overviewList &&
                overviewList.map((item) => (
                  <div className="mode">
                    <div className="mode-text" style={item.name === 'Return visitor rate' ? {} : styles.borderRight}>
                      {item.name}
                    </div>
                    <div className="mode-num" style={item.name === 'Return visitor rate' ? {} : styles.borderRight}>
                      <span> {item && item.value ? <CountUp end={item.value} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per" style={item.name === 'Return visitor rate' ? {} : styles.borderRight}>
                      {item && item.rate ? (
                        <>
                          <img src={item.rate >= 0 ? icon1 : icon2} width="14" height="14" />
                          <span>
                            <CountUp end={Math.abs(item.rate)} decimals={2} suffix={'%'} {...countUpProps} />
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={styles.itemDisplay}>
            <h4>Product traffic</h4>
            <div className="data-statistics">
              {productTrafficList &&
                productTrafficList.map((item) => (
                  <div className="mode">
                    <div className="mode-text" style={item.name === 'Product view' ? styles.paddingRightZero : styles.borderRight}>
                      {item.name}
                    </div>
                    <div className="mode-num" style={item.name === 'Product view' ? styles.paddingRightZero : styles.borderRight}>
                      <span> {item && item.value ? <CountUp end={item.value} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per" style={item.name === 'Product view' ? styles.paddingRightZero : styles.borderRight}>
                      {item && item.rate ? (
                        <>
                          <img src={item.rate >= 0 ? icon1 : icon2} width="14" height="14" />
                          <span>
                            <CountUp end={Math.abs(item.rate)} decimals={2} suffix={'%'} {...countUpProps} />
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={styles.itemDisplay}>
            <h4>Traffic source</h4>
            <div className="data-statistics">
              {trafficSourceList &&
                trafficSourceList.map((item) => (
                  <div className="mode">
                    <div className="mode-text" style={item.name === 'VET traffic' ? styles.paddingRightZero : styles.borderRight}>
                      {item.name}
                    </div>
                    <div className="mode-num" style={item.name === 'VET traffic' ? styles.paddingRightZero : styles.borderRight}>
                      <span> {item && item.value ? <CountUp end={item.value} {...countUpProps} /> : '--'}</span>
                    </div>
                    <div className="mode-per" style={item.name === 'VET traffic' ? styles.paddingRightZero : styles.borderRight}>
                      {item && item.rate ? (
                        <>
                          <img src={item.rate >= 0 ? icon1 : icon2} width="14" height="14" />
                          <span>
                            <CountUp end={Math.abs(item.rate)} decimals={2} suffix={'%'} {...countUpProps} />
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="container-search">
          <Headline
            title="Traffic trend"
            extra={
              <div>
                <RangePicker defaultValue={[moment(new Date(sessionStorage.getItem('defaultLocalDateTime')), 'YYYY-MM-DD'), moment(new Date(sessionStorage.getItem('defaultLocalDateTime')), 'YYYY-MM-DD')]} format={'YYYY-MM-DD'} />
              </div>
            }
          />
        </div>
      </div>
    );
  }
}
const styles = {
  borderRight: {
    borderRight: '1px solid #d9d9d9'
  },
  itemDisplay: {
    width: 390,
    display: 'inline-block',
    marginRight: 10
  },
  paddingRightZero: {
    paddingRight: 0
  }
} as any;
