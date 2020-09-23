import React from 'react';
import { IMap, Relax } from 'plume2';
import { Icon, Modal, Checkbox } from 'antd';
import { fromJS } from 'immutable';

import { history, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import PieChart from 'web_modules/biz/chart-pie/index.tsx';
import Funnel from 'web_modules/biz/funnel/funnel.tsx';
import BarLine from 'web_modules/biz/BarLine/index.tsx';
const icon1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAD50lEQVRYCcVYMW8dRRCemV2fsRNQkBwUp0iCRAUFSgAJCiQkIBFOQDRQ8QcQHR0VLiiiSBSRCFUEBSKWiJSCEEcBOoTcABFCVFShSBoLmYBf/O7d7jDfhb3cO9+99yzb8pOs3Zmdme+7udndOTNt4ffW719lvTC7Ly+yGY19P63s86Aucxz6rAXLdJH5/N6s661ffurtfNLQPM5QVfnVn79/JJP8wCCP2Tj7tD5lDma+9t0zr9xlZk36tnEkiZO/3tjnQzG3FfAmCMgUzq9++/Sp9eZakltJ4OkXfrg+V2ThQDLc7uhzt7b84murbVnZRGJRVX5a+Wa+LzS7XeCm/3Sk3rMvnLmzyBzra1IXkIHdIgAcPBjiA6eOO0QCr2A3MlAHRHzg1HUVIxSh3ssP1xc3zUN8XSke26RvUzD3if0N2xi3WpdnstupWD0MkJ7TN5fnBm3WSQcCGj9O4thRbVdK8U7k7GWhsCk0dp3h9lCo5evAObCdbdhJKOohKcKxtnXgARdrZSbKg6jNsq5zcpWDZW2S16F0xlwfv+8e7BW7P+qh0hy4Nv/b4yhe+2fCkxBEaKiWU7xy1EjPeeZ/BzGfZ+WSRBSd7/JANoDvcRfg+bbzsxNRXN4/a8X1ZmGBhN2SZawMaW98flRs4NuZms2MMhq3ZjXtjcB5EEi2kflumhPFkTsO+ILb8IHD1mby0FRGWnxqBE4lT2ZZcqwrD2QemQngC67j5LCVUZhmw/rGRYr6UuXH9Bk5+dDOh9uVLtJIEsAX9AOVw4QT8fRwKIrPLQPPJxclvsDOny3l4O9UetZDkY1yxw/4goakY71VLbF4tNgovrBaPp4MmOmceHc+yWpFYvO/SllpKsbiYFprjsAXdETNhS7ZHuhgiPylPdaTpQ2aFZZFcv5i08cWqmwId+8Q4Nv69GQkoh6O+WDJtvMTADQiwf4+YCeXmgQgC3NVF6zaWRfAF/SEbUHqOtuGRykGI0BHSj3TIDr/Pjl3pW43NGeaiATwBU3pkHNDUOf22/1zyY6z+0+j1Hfi37NSu94wHRaVfqsUSqvVvDEBflm1C79cO9p5gcVwUqN+Al+78XrWjrzL4lYasdrFEN+wBbVte7XNAP3n8onTt8ozAl0x08ZjbYbkp36kQb7CxPtV5CMjcrPVrk3p5Os2ddIBF/MyE//3E0c6s5G8dnBEFq4dX/iz6icwQVu+gxhjQwEPuDCsblm0WmjLx3rvgAFwUms3RAICvgvQlu8ATmcIxAdO3aDKBJRID74LdosI4iJ+eg2JSFmYSUgjCnVPv8ASEYx7+i1aJ4Ks7OlXeZ0M5rv1/4n/ANnU1qrBziWWAAAAAElFTkSuQmCC';
const icon2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAIQAAAAAWQIAAAAAEEklEQVRYCcVYO2wcRRie167vkVzsJA62Y4STQGUFYUBIESIFCBBIgECiMKEBuUIIpQqUpkoT6KgRdYQoaHgICUFDgTBCCkg4ds7GvgTFUiI/7rE7O5P51vznvfWuLxds55p//sf837fz7878c5z18Lsy/qZ/XNTLqyooqsCqUDAldCCN8iPPMK19rivabyyb0sb4lcvB3abm3QKttXz+yecrRWP6o6b2u8WTXxZU0BDi9slfv1/lnFuyZ8kdSdx49IWykfpoL+BpEJARkVoZ+uO7jbSP9EwSePqrj589Wmjyfgr8v7JZsLcf/u2nlaxVEenkdnpaLD323MhuEgAG8iEv8qcxO1YCK4BAFuhSOnDXdF/VR3//oZZckQ5WKMGeEsCTuAeMcRJP1SaBl3C3S5DA6RgCB3hkjEmgDPgKyLgfEnjABVZMAvtA3mfY12iUzez8F3Z27kteq03sFkHgAbdNAhtRXvJw5dbTzJgz1tjTZq3+OV9ePpMXm7bz6j+v8urSK2k76YQrsRX74doRcqSl78l/o9W1N5wdNfRsEL2smo2/bKVSTccmdRCIWq1LNtIvivV6lfVX/k76MbbayKkHnloXOAvSzqTeKpXW5eCht1zlrm/abV+40fzMVBdfSsalxybSp8lmbP77BnyBw4iC86Q5PLggjg1McsYXN2Osx1vBp44IVij7Z8wIObjy/nsAsmxJ4AuchlumHUYDAzU5NDjJGL+KKHciSUfkIru26FZp+88yu0VCqlwSwBc4jrenyLaYQ5WbYmT4HBPiT0Q4ItwEwTSbX5zaNsOwYbJF5WIuibgdQD9AwXclD5ZuFY8Pve2IzFC8CYMLdn7hA9JtUO9z48ObOg9l5cBN8qUl8AUakrSjmx6/rA+OvMOF+IVibRi+b+cWPoIu1zbaq+B2oxuWi9x+AvgCHREl6kXaQqHujQ1POSI/0jyrw3fZ3LWPdSPYeh8Ezy0F5gFfoCWjJL1K7RUDdWL0PSvENzTX6GiSB2F7QzNdSABfoCekBPciI+Vr79RD54WSX9F8bmy8HUPnXNTIniWBL9CUZjl7sRkhDTt14kNxoHxOVQ6+Zjj3aL7htMmRpVMCX6Errk08G+QdYMkpOAciE40lbemxgUGbJ8guPZn7TqD/HJ+5HMR7BLpi10Yfo4lZMibQan6S5dvRprzccgAXc+OjHG05WO2Y7B6c+DzVkeyDDnjARdp4JdDvuU5nJWK6/WmlMe3Y6NeyusS6lYPmOQIt2V/6Vnt9IdmSEtcA6jPjzoacsxPPDO5Hi4f2/5GZn9u7aFwOIoF7AXPdMOl7Il3+GCeRvIMElmf09bPX94wI2n2Xn8pAPDrKQcb9voFlkiAy9/UuSiQgsSr39VaeJIPxXv0/cQeTu+OSeUihNAAAAABJRU5ErkJggg==';
const img1 =
  'data:image/png;base64,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';

@Relax
export default class TodoItems extends React.Component<any, any> {
  state = { visible: false };
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

  props: {
    relaxProps?: {
      tradeTodo: IMap;
    };
  };
  static relaxProps = {
    tradeTodo: 'tradeTodo'
  };

  render() {
    return (
      <div className="item">
        <div className="item-top space-between">
          <div className="item-top-l flex-content">
            <div className="item-top-l-top">
              <div className="top-text">Overview</div>
              <div className="content space-between">
                <div className="mode">
                  <div className="mode-text">Revenue</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon1} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Average basket</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon2} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Conversion</div>
                  <div className="mode-num">
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon1} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="mode">
                  <div className="mode-text">Traffic</div>
                  <div className="mode-num">
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon1} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-l-btm">
              <div className="top-text">Conversion Funnel</div>
              <div className="Funnel">
                <Funnel />
                <div className="Funnel-l">
                  <div className="Funnel-l-text align-items-center">
                    <span>Landing page</span>
                    <span>3200</span>
                    <span className="Funnel-l-dash1"></span>
                  </div>
                  <div className="Funnel-l-text align-items-center">
                    <span>Shopping cart</span>
                    <span>700</span>
                    <span className="Funnel-l-dash2"></span>
                  </div>
                  <div className="Funnel-l-text align-items-center">
                    <span>Checkout</span>
                    <span>500</span>
                    <span className="Funnel-l-dash3"></span>
                  </div>
                  <div className="Funnel-l-text align-items-center">
                    <span>Payment</span>
                    <span>300</span>
                    <span className="Funnel-l-dash4"></span>
                  </div>
                </div>
                <div className="Funnel-r">
                  <div className="Funnel-r-top"></div>
                  <div className="Funnel-r-mid">
                    <div className="text1">Conversion rate</div>
                    <div className="text2">
                      1.69<i>%</i>
                    </div>
                    <div className="text3">
                      <img src={icon1} width="14" height="14" />
                      <span>32%</span>
                    </div>
                  </div>
                  <div className="Funnel-r-btm"></div>
                </div>
                <div className="Funnel-per1">
                  <span>88</span>
                  <span>%</span>
                </div>
                <div className="Funnel-per2">
                  <span>88</span>
                  <span>%</span>
                </div>
                <div className="Funnel-per3">
                  <span>88</span>
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="item-top-m flex-content">
            <div className="item-top-m-top">
              <div className="top-text space-between">
                <span>Traffic</span>
                <span>more ></span>
              </div>
              <div className="traffic space-between">
                <div className="traffic-l">
                  <img
                    width="40"
                    height="40"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAACTCAYAAACzgppOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAjaADAAQAAAABAAAAkwAAAAB9cEo3AAAaAUlEQVR4Ae2deawVxbbGW2VQlFEERMQjIOCIOAIq3OdlcMSL3gDKCzgk+pye0bzoP/7hPF6jMVFfTFSUh0QliGKuF0QFUZwVREAQEBAUEQERkYsD7/s1u7brNHufs8fe3b33l3x0Ve3u6lrVq1etWlV98Lwaaj2QZw/skef5UTx9HzXqQPEAcX+xldhMbC6Cf4s7xC3iD+L34rfiL2INBfRAXJXmIMl6hNhNRGHylWOnrkFxVoiLxLViDTn2QL6dnWO1ZTkNy3GC2FfEqpQSWJ9PxY9ELFMNDfRAHJRmb7W/v9hPJN0YtusEHrx7+CgbzPXa93TuuyL11JChB6KuNH3U5mHivhnaTtE2kSFmpbhO3CBm81XwfdqLncQ6kaGthZgJP6twujg/04/VXhZVpeFh/l3snuEB/aoy/JB54lci/kkhQPZDxWNF/KOmYhDLVTBZRDlrSPVAFJUGf2WM2DbwlFAO/I43xJ8CvxWbbakKThfxl4J9skllE0X8nhrUA8EOqnSn9FADRor4IBbLlJkhfmcLy5DuqDqHirTDAv/oeZF2VD2ipDQ4umeItk34JwwPYT8slIbhET/IAUv3LxFHuaqxV0Sk7692nClahcGpHS9WIoayUffFb0J5nLNM2w4TsTprxKpFFJQGZ/d80SoMDugEsdS+i6rMGVi5z8TOYjtzFe39WsTXqUrsVWGpeRhjxaamHR8rzZDELKnS+E0NWCDiKKM8AOXuKWKJsk3v9VNyUUmlwdm9WGxtutdNcf8wZZVO4st8KR4sOouDkncXieP8LlYVKqk0OJp1prfxIyaIUbAwpll+EsVZKhLPcc4xAUcWSBeKVYU9KyRtL92XB+CwQ4lJYpTNPW2jjbTVARmQpapQCaXBtDNTspiqzHpbENE0baStFshifTL7WyLTlVCaE9STNtq7Svk4mXjaSpsdkAWZqgZhKw0+1IBA774WyMchG2wzMlXSPwy1z8JWmj6Sjp11DkuU+NplYnSkzbTdAZmOcZmkH8NWGhYEHZiRzHSZGB5pOzI4HOcSST+GqTSM/V1NhxL7iIPza5pcL0nbkcEB2ayv5soTdwxTaY4K9N78QD6O2aAMQRnjKFOjbQ5TabqZ1vyqtPUJzE+xSiIDsjhYGV1Z4o5hKU0T9RxheIfVStjOduVxOyIDsjggI7ImGmEpDftybQDsqwT1qpUFGZE10QhLadjCabHWZmKeDsoSlDXm4u3e/LCUhoU9C750TAqCsgRlTYqcaTnCUpo26Tt6HntUtph83JPIgkwOVlZXlqhjWEqzt+k1VottUMz8FMskstjVeStrLAVqrNFhKQ0f5DvYrQWuLO5HK5OVNe5yZWx/WEpjp6HWlGdsVAwLrUxW1hiK0niTw1IaG5OxU+/GWxiPM6xMVtZ4tD7PVoalNEk333ZIsrLm+TjicXpYSmMdxRbqmrDuG8ZTQBZkcrCyurJEHcN6eGwad+CeSVoNRhbbj1ZWJ3OijlbYcgqW5ABYMJgXlLWc/VqRusNSmuBfXLCLlxURvIQ3DcoSlLWEt4pGVWEpDRuWthuRDzXpuCetLMiIrIlGWErDF5MrTU8epLT76MwUxy6JDMjisFKJKH0d6tpV0mNYSkOjl5uWc98jTT6uSWSwfWhljKtMjbbbCtzoyUWewPdC9i08tsj6onC5lQHZkDHxCFNpflZvLjM9igNZZ/JxS9J26wQjGzImHmEqDZ35UaBHhwTyccoG2x6ULU6y5NXWsJVmqVpnZxddlD88rxZH42TaTNsdkAnZqgJhKw17T+YEenaw8mG3I9CEvLK0lTZbIFOS9ghZ2XZLV+JhLVAr1pqWtFe6v8lHPUlbabMDsiBT1aASSsMb+Ypo30z8g+4x6HXaaH2ZTLLEQIzimrhXcZcXfPVPupLtBF1TNeyhI38cKMp/x44/nTZObCo6zFVinstUy7FSSkP/fiUyZeVhAHa88SbzqevvYpTQXI25WAz+fcCpKrMWU9nko5JKQ2cz4zhCdEsK+yrNrITPXX8TowDadqFolwvY/jBBTPwuPcm4GyqpNDQGxVghEll1bWF/ClPaZWKlNzSx7eFisbPosEOJ8eKPrqDaju5BVVLubbo5cQ7WcfBtQAuRPxK0VtwsVgKsXo8VW5mbs1TwvLjalFVdMgpKQ6ezcWmNiDOMbwNwOFEcrNG3Ig8sDHD/AeII0e79ZdvDJPFLsarh3uyodALxjzGic45du/iT8jPFz11BmY78fZnBIkOkBT7MRHGDLazWdNSUhufA0DRKrBODYLiaLq4K/lBk/hBdP0y0zq6rcqUSz4kMozWoB6KoNDwYhs0hYj8xUxvXqZz4CJaHmE8hwFfBj8IJ75ShAmZ3/Dc9r4lRCwFkaG54RZkeSHh3b/xOB+qUc8VMFsBd/b0SX4nfiaRxnPE/mOUA/BK+r24jHiB2FA9NpXXICCzaNBFfqoZAD0RdaWgubWQKPkjMZBFUXDJgwWaLi0UsTQ0ZeiAOSmOb3UOZ48VeYqlmfszOvhA/FYkN1dBID7jpbSOnReJnhigsTnexWIUhMEdQkWGN6DPDWQ059kDULQ3tO1o8TeyQg0z4MVgOiPOKMhCIY+azVWTKDEnXUGAPRFlpekomYiY4rpmAz4Hzu1JclWJV7NGVrBVFFJXmYPXIULFrlp4h0PeJiA9S6HQ7S9W14lx6IEpKw9QYy3JyloYvUvmHIn5IbWaTpZPCKI6K0hwiYf8mBpcP6ANmNDPFWsyE3ogAKq00TdUHfxX7icG2EGAjGotlqTTaqwHnpBoxS8eVqXRVHoIPKsxOIIzP5qbOgZv+qvwM8YNAeSWzY3RzHHMHfCra+IsrqKZjpeI0OLujxf0Cnb1K+anixkB5pbNM5S2OU4YA47/Ez+wP1ZAuNkhWSB/11UWjRNaDHIirMBS9IkZxNflrtQuLyPqVA477ESKzPGJBxISqAmErzTD1KqvX9tMZps0TRGZHUZ0VYWnmiUSScdrxxRxw3k8Q2SSGHxZVGdS00iAspcF3YrU6OJ2mk8eLRGnjABY0iQ8xrHYyDeYl6C72FleKUbSWalZpEIbS0KHDRRYaLfAFnhPj5kziqC8WGZIYmvYRHVCmPiKRarawJhLlVhoUhvgLfozFLGX+KWLS4woXmcaK4ti7mSiTC9bLWPtCsRKHcioNCnO+eEyg115XfnagLK5ZlH6F+IV4qMhWVYACdROJ73wpxvnlUPPro5xKc5ZudVz92/mxjbcDZUnIslDKcMtOw3ZGoI5K9xBRnH+b8lgny6U0/dUrgwI9Q0xjbqAsSVnCBp+LzKy6GsFaKo21ZajaYspjmyyH0hyu3jhPdGM8nUP0NMkKg4yA6fZyEX/nMJEhGhDTOVZklsg+5lij1EpzkHrjItHWy8o0fkw1gdkTytNTbJ4SHAXihYq94tiHm5Kt4ENrXXmJaCO9jOVTxMQHvCRjEAQtF4iHiK1SP2J9Y684pVIa3qIxIp+IOBAImygy1lcriCSjOHUiLxWIveKUSmn+os7oQ4+kgMM3Xkx0ZDQla2OH33UCwUB8HIJ/AMUherxK3CzGCqVQmjpJTACPjgAMRc+K68nU4PcA1hbFQVFcLMf5OEtUFquXq1iloQPGic7ZU9KbJc4nUUO9HvhVOYKAR4jO7yN6jLPMVJ2hLBYoVmlGSsrORtKVSr8sVqPja7oha5IAH5ODo8RmqbNQIJxlXrRY9FsxSkPc4VTRARP7jLjdFdSOGXuAfmI6zvoUlgYwu8JaLyMTdRSqNPtIMOIx7m1BzufFb0jU0GgPbNUZX4tMHpwv2EXp9WLkg3+FKs2ZEq5OdMC0JnFNyclXjuOPqhQ/h7UpB2ZYC8VfXEEUj3jw+YI3wu6NYTianm8ltfP9Hpirf5lVOTBEjRCd9XHlkTrmqzScf25AqNeUr30OW/hjnapLN5nLWew82eQjl8xXaU6SBJ2MFGuU/tjka8n8ewBLHVxqGayytvlXFc4V+SgNTu9A0yymh9PEWEwTTbujmFytRn1gGtZU6eEmH6lkPkqDydzXtJ7V63UmX0sW1wMzdbldUuimPIubkUOuSoODdopp/W9Kv2XytWTxPUBEmMCoxVBlCp3h2npKms5VafrprsRmHLAyP7lM7ViyHiDox1qUQzsl8CMjhVyUhjD3ANNqYgu1mIzpkBInZ6g+uxF9kPL2hS3x7fKvLhelwcq4BTbu8L5IRLOG8vQAO/uw5A4oTKSsTRPXsixHxtMTzW+Mu++YfC1ZWA8wE2VTFi8jSuGI78ii5vcifqN7Pry474r0f8XhGpWtIb31g9s4xDmfiCy41ZB7D/DidRAPSpGIOjsc84n6ttD514pLxbXiGhGLZIcxZcNBY0pjrQwtsmYznBbG8y4M+3UiC5JHiFiWYsFK+AkpUhfrU+zDmSeiRKGhIaVpr1YcalryldJodw3Ze6CjfkJRjhFbZjutWbNmXrdu3by2bdt67dq1S7NVq1beli1bvI0bN6b5ww8/eCtWrPB++43Rqh4Y0nip4Q8ii8bQxnqULT0aUpqglbERy9K3JN41dlbz/yr2yCRGXV2dd+KJJ3onn3yy169fP69v375eixaMOLlh69at3scff+y999573vvvv+/zm2++sRfvr8zp4n+IWJ43xR/FsmCPLLUSxv4f0c2aiMk8KLJJuoY/ewBfhYd1+J9Fu1KdOnXyLrzwQm/cuHFenz4Yn9LinXfe8Z5++mnvhRde8DZv3s248Jx4yeeIP5f2ztmdMTphtLnZLKXR3hp29QD+xRDxaDH94jHsXHDBBb6iDBkyxNtzz1wiGrsqLPTf7du3ey+99JL3xBNPeK+9xoaDemAmxmwX7ja+1Tszj0xa4MA15ytvX4+HlWfcrGGXv3K2OsJZYV85Ro0a5d12221ejx4ZR6hQ+g3rc9NNN3kcA1in/GSRqXzRyPQqMEXsZWper3RNYXZ9ejJSfXGBmFaYs88+25s3b5737LPPVlRheF6nnHKK9/bbb3svv/yyd+SRR1Lk0EmJ/xJLsk8nk6XprsrHurvpOFt8w+SrMdlTQp8npmNWPXv29J588kn/QRXaITizy5cv99asWeM5x7Zz585ely5dvO7du3ukC8Uff/zhPfbYY96NN97obdtWL7T2peqcKm4ttO5MSnOOKrMzp8eUx7xVI+gfZkWnWeGvvPJK7x//+EdeMyB3/dKlS73nnnvO90OYETWE448/3jvvvPM8hj6UtBB88cUX3kUXXeR9+umn9nIU5v/Eb21hrumg0pBn1uTeqE1KP5RrZQk7j3DECPEoJxdvPtZl2LBhrijnI9bklltu8Wc8GWIuDdbTpEkT37nmeqxQvtixY4d38803ew888ICHBUqBJYlJ4gpXkOsxqDQH6kLGPoe5Skx3mSo6EkS5UOzqZD733HO98ePH+4E4V5br8cEHH/QfWmCY8Pbee28/ftO1a9f0UMQwtXr1au/DDz/0mBlZENu54447vOuvv94W55x+8803vZEjR3obNmxw1zA1Z6j6zBXkcgwqDY7SWebCZ5RebvLVkCRQ9p8ie1l88JAYjvKdQvOGX3755b51cXVxRAEvueQSj2n5fvs5o27PkMOhgB5T6KeeesqbNm1avR+J/Tz++OMeU/x8wXB15plneitXrrSXzlBmtymXPcGmg0rzd/1I7AHsFO8WmetXC1gGuFjE0ngMCyjLddddRzYvoDBDhw71Zs+enb6OqDBWh1lOPmAKjeJifRwGDRrkzZgxoyDFwZqdccYZ3oIFC1x1HN8SX7cF2dLBKffB5kSm2tWkMO0l7zjRVxiGgsmTJxekMPQhFsYqDM7z3Llz81YY6kLJuJY6HKibexQCfDOm5iiewUCl2YLRKIjJOBDlPN1ldFwsLjX5JCfbSLhLxJYIySLizJkzvdNPt93BL7kBa3LfffelT8Za3XnnnXkPb+kKlGBoJCbUsmVL38Lw2/z5873WrVt7/fv3t6fmlG7evLk/q6IOZnQpHKbjRvE7V5DpaIcnokEErxymKMGqadKBolwq+j4MK80oDENJIWCW1KtXr3RsBOvw6KOPFlJV1muuuuoqPwbDCVjEJUuWFDSr4nqcbYYqYxWZXk0Ul/F7JtjhyQ5NnLs60wUJK2MoYkjyFYYHQDS1UIWhb5gWu1kSq9oPP/wwxSUFdbo2ci/uWSiYwU2dOtU7+mjnyvp/kXSU6mPTWEZYS8OMAfMEfhHv8VPJ/aeJRMPC+J3DTITOY2ZRKDDzhO9dHAa/IV+nN9d74xyfeuqp/uk47AsXLiw4AEglOMe01cyqCCP/r7jbFgtradJTTJ3IuJZ0nCMBfYWh05955pmiFIbOItLrFIZpdbkUhntRN/cA3JN7FwOc4+nTp3sdOnRw1WCFcVes3+v/5pSGI86gQ9KV5iQJ2tcJ+9BDD/mhepcv9MgWBQfiMOWGvYe9d6H3ZakCa2viP11U15BgfU5pWukHq1FJVppDJGt6DLrsssu8q6++Otgveecx724tCd+IwF25wT3wSQD3pg3FgpnYPffU80yYmh1u63VK09YWKs2aUxLBy4HJ9eXGmSzVzIbVagcWGrNFet05pThyD+cQU59tQzH1E0gcMWKEreJvyqTdF6c0hM4tkmhpcHxHi37cnu2YU6ZMsabYyp93mqm2A2tJYcHey7ah2PuzMMvm9xQwZ7xs9GH6P3zgDbRIoqVhaTo9jaRTClkxtp1k03ZoKGYfjK0zl7S9l21DLtc2dE6bNm38yYE550ClB5N3lia48pXE5YN6S8a33357pg3Zpo8KT5rtB4VXkuOV9l75Lqg2dAviP7feemvwFL8PsykNey2SBhbjoI93333XGzhwoLdu3TpXVNTRvvGlqjOXBtl7MeSWAijMWWedFdyoPkt1w4yW5leV7+THBOItyfSK6MvHKu9pp51mA1oFi2yHOvbDhAV7L9uGQu/Plozg6rzqmim+6erMZGmSaGWcvBzZXzBFZI3FW7Zsma84ixYtIlsw2NPrwBYGOr/c4B52u4RtQyH35vupwYMHB79mmK665tj6nNL4q7upH4jXBGdT9pokpD+TEGx1/A1hmHUQn3j11VfJFgSGJ6bagEXADN8gFVRvQxdxD7e7j3vbIbKh6zL9xqe/9AFfcBr8U+m5Ju8nndKk5+AqZXr13+JlIlHToJOsokSA/QATRN/p5xvq4cOHe/fff3/BwrEJ3IEdd+WGvYe9d773xb9DYdjVZzBN6Xoa5H5zC5YoSTbrwnD1uThfZLD2zbqOSUFHCXKRmF5GKXQ7ZRwXLFmzuvTSS9Mr8+oHrC/D90IxIxiKwGKRrREsUrkyJX2QZ46O1TlBxCrhLG8Rk+Aw863zApF1Fl9x2Jj0+uuv+5ue8ons7r///v6mcPe5CI4260OlnAqrjf4CJRvEXVyGe9h1KM7JBXfffbe/hMLW1BToC6zvn+Ft94s5Okvjioj49RSPE3uIwd9VlMY2pVA2NHKV6PsHOsYVvBxni7scEyWYwvIFQj6frMRhExYOL9blxRdftM/qe2Umio0GdoNWhaGHiz8TPxF/EXn79hGDaKqCzmIfcYBI7BxLhY+AQsUNWM0lIjJ3F/dgdsLntps2bfK3fu61V7C7dFYA7PxjwZJtBuCjjz7yt2gOGEAXFQ++XbrrrrvSFd177715KTWOLgud/NkSgxVKTxBzmvI11As8fCwIztAykTyzLBzlIKgHn+gw8SQRS3WAiBON7asXjVU+ylirxn0tYmmb7dy5059RsPWAjdgHHIBYDQOnks1MDHOArwbWr1/vP9xChyr2zFxzzTX1FAbfC6XJFZw7duxYjz+UZMDzxeTgcuSEhoafbBVgXY5MsW22kwLlPynPg3D8VumoD2f7qo3Dxd6iDywIfxmCT1rYuNUQMn3CwvZPLEW+m7OK/YQFBebLhUAYAIs6Vaw3ZWpIJvdbIUrjruVI3BofiLcSR9pN4ZVsEL/rV4bB78T1hpuVjhpw/s8QGY59sKXzkUceCX4C4n5OHyv9sRzWCSXlq8xAsJFZ8GTxx3Rj80gUqzT2Vs2VqRNRINhOzBcMgSgTzhgKhFAcXZqhLkwwvLYW8dcGpdI67MKYMWP8T1UaC6pV4rPcOXPm+N9JsXfYAL/tLXGWiP9aEEqpNMEGtFEB1scRq5SrJQrW5fL4RjjZmNbgEYXDglkyBJIH+F2MKRwtUfZ9RJz44DGT/6bT/gSO7w033OBde+21DX7nzazqllvK/wcAiBUxhE6cOPHPRu5KrdPhFREXoSiUU2mCDcO84w+hROxr6SDiPIfZBt2uPEB5rrjiCl+BGlpt5qGW40+NYFH4II+/wec2t6ck5WV6Q/xALNi6pOryD5V+YLz5TEdQINhRRJEYErAGUQSWi2HzZ5EhGIc5DfbsEmhDgRr7A40E54r5o0bspWEYYvjjjwTYvTWpBi3QcbrIRKRkqLTSZBOEdrEtkyEOokQcmfIzhNhhpFTKhTLYYY80nb1ZtL4VsQwXCWe4PVo8VUTp66F3797e6NGj/b/yWegfJapXYSpDxHnSpEk+s2zx/FKnzhaLHooy3T+qSpOprdnKcFZRIo4okKXzYVTs+zbOx0FBHHGuUZBinGz68TBxoHiwuBuwOnzcxrSbzeAoVC7AeixevNgPxrENgs9nAwuLrhoUeZE4RySkUTYkQWnK1jkFVnyIrmOajlagyBnBHxlg/0v79u19kscvIsTPXyznDw9x5DttVuAbAMMkU6T3xQ0NnFeyn2pKU7Ku3K0iHH+sz1FiLxGrVyrg3C4W8VlWiCVxcFVPTqgpTU7dVPRJTOsZtpg1OuKz5QpMzVpxTeqIr1KxiHpNadT7FUIr3Rdapx7lwopsE/GzIE54SWc/qq+GWg+E2wP/D/dQkF+2XgeoAAAAAElFTkSuQmCC"
                    alt=""
                  />
                </div>
                <div className="traffic-r flex-content">
                  <div className="traffic-r-top flex-start">
                    <div className="mode">
                      <div className="mode-text">Page view</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                      <div className="mode-per">
                        <img src={icon1} width="14" height="14" />
                        <span>32%</span>
                      </div>
                    </div>
                    <div className="line num"></div>
                    <div className="mode">
                      <div className="mode-text">Bounce rate</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                      <div className="mode-per">
                        <img src={icon1} width="14" height="14" />
                        <span>32%</span>
                      </div>
                    </div>
                  </div>
                  <div className="traffic-r-btm flex-content">
                    <div className="mode">
                      <div className="mode-text">VET traffic</div>
                      <div className="mode-num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="mode">
                      <div className="mode-text">VET traffic rate</div>
                      <div className="mode-num num">
                        <span>$</span>
                        <span>4,524</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-m-btm">
              <div className="top-text space-between">
                <span>Transaction</span>
                <span>more ></span>
              </div>
              <div className="m-content flex-content">
                <div className="transaction space-between">
                  <div className="transaction-l space-around">
                    <div className="text">Order Number</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-l space-around">
                    <div className="text">Sales volume</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transaction space-between">
                  <div className="transaction-l space-around">
                    <div className="text">Units sold</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-l space-around">
                    <div className="text">Retention rate</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
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
                      <span>$</span>
                      <span>4,524</span>
                    </div>
                    <div className="mode-per">
                      <img src={icon1} width="14" height="14" />
                      <span>32%</span>
                    </div>
                  </div>
                  <div className="mode">
                    <div className="mode-text">Active consumer rate</div>
                    <div className="mode-num">
                      <span>$</span>
                      <span>4,524</span>
                    </div>
                    <div className="mode-per">
                      <img src={icon1} width="14" height="14" />
                      <span>32%</span>
                    </div>
                  </div>
                </div>
                <div className="consumer-btm flex-content">
                  <div className="mode">
                    <div className="mode-text">Total consumers</div>
                    <div className="mode-num">
                      <span>$</span>
                      <span>4,524</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-top-r-btm">
              <div className="top-text">Subscription</div>
              <div className="subscription space-between">
                <div className="subscription-l">
                  <PieChart total="100" shelves="60" />
                </div>
                <div className="subscription-r flex-content">
                  <div className="subscription-content space-around">
                    <div className="text">Order Number</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="subscription-content space-around">
                    <div className="text">Sales volume</div>
                    <div className="num">
                      <div className="num-l">1430</div>
                      <div className="num-r">
                        <img src={icon1} width="14" height="14" />
                        <span>3.2%</span>
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
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon1} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
                <div className="line-1 mode-line"></div>
                <div className="mode mid-l-l-content">
                  <div className="mode-text">Active prescribers</div>
                  <div className="mode-num">
                    <span>$</span>
                    <span>4,524</span>
                  </div>
                  <div className="mode-per">
                    <img src={icon1} width="14" height="14" />
                    <span>32%</span>
                  </div>
                </div>
              </div>
              <div className="item-mid-l-r">
                <div className="r-text">Prescriber reward Top 3</div>
                <div className="r-content">
                  <div className="r-content-list space-between-align">
                    <span>1</span>
                    <span>Velvet Pets</span>
                    <span>$ 1213.00</span>
                    <span>1 order</span>
                  </div>
                  <div className="line-1 r-content-line"></div>
                  <div className="r-content-list space-between-align">
                    <span>2</span>
                    <span>Velvet Pets</span>
                    <span>$ 1213.00</span>
                    <span>1 order</span>
                  </div>
                  <div className="line-1 r-content-line"></div>
                  <div className="r-content-list space-between-align">
                    <span>3</span>
                    <span>Velvet Pets</span>
                    <span>$ 1213.00</span>
                    <span>1 order</span>
                  </div>
                  <div className="line-1 r-content-line"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-mid-r">
            <div className="top-text">
              <div className="top-text space-between">
                <span>Best seller</span>
                <span>more ></span>
              </div>
            </div>
            <div className="seller space-between">
              <div className="seller-pro flex-start">
                <div className="text">TOP 1</div>
                <div className="seller-content flex-content-start">
                  <img src={img1} alt="" />
                  <div className="content-text1">MINI PUPPY</div>
                  <div className="content-text2">2.692€</div>
                  <div className="content-text3">85 units</div>
                </div>
              </div>
              <div className="seller-pro flex-start">
                <div className="text">TOP 2</div>
                <div className="seller-content flex-content-start">
                  <img src={img1} alt="" />
                  <div className="content-text1">MINI PUPPY</div>
                  <div className="content-text2">2.692€</div>
                  <div className="content-text3">85 units</div>
                </div>
              </div>
              <div className="seller-pro flex-start">
                <div className="text">TOP 3</div>
                <div className="seller-content flex-content-start">
                  <img src={img1} alt="" />
                  <div className="content-text1">MINI PUPPY</div>
                  <div className="content-text2">2.692€</div>
                  <div className="content-text3">85 units</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="item-btm space-between">
          <div className="item-btm-l">
            <div className="top-text">
              <div className="top-text space-between">
                <span>Traffic Trend</span>
                <span>more ></span>
              </div>
            </div>
            <div className="line">
              <BarLine
                yName={{ y1: 'Traffic', y2: 'Conversion rate' }}
                unit={{ unit1: '', unit2: '%' }}
              />
            </div>
          </div>
          <div className="item-btm-m">
            <div className="top-text">Prescribers Trend</div>
            <div className="line">
              <BarLine
                yName={{ y1: 'Prescriber reward', y2: 'Active rate' }}
                unit={{ unit1: '', unit2: '%' }}
              />
            </div>
          </div>
          <div className="item-btm-r">
            <div className="top-text space-between">
              <span>Transaction Trend</span>
              <span>more ></span>
            </div>
            <div className="line">
              <BarLine
                yName={{ y1: 'Revenue', y2: 'Transaction' }}
                unit={{ unit1: '', unit2: '' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
