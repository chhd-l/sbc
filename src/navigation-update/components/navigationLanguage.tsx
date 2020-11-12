import React, { Component } from 'react';
import { message, Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import { cache } from 'qmkit';
const img_left = require('./img/left.png');
const img_right = require('./img/right.png');

export default class NavigationLanguage extends React.Component<any, any> {
  static propTypes = {
    navigation: PropTypes.object,
    store: PropTypes.object
  };
  static defaultProps = {
    navigation: {},
    store: {
      languageId: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      languages: sessionStorage.getItem(cache.STORE_LANGUAGES) ? JSON.parse(sessionStorage.getItem(cache.STORE_LANGUAGES)) : [],
      current: 0,
      defaultNumber: 3,
      selectLanguage: this.props.navigation.language ? this.props.navigation.language : sessionStorage.getItem(cache.DEFAULT_LANGUAGE)
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.clickLanguage = this.clickLanguage.bind(this);
  }

  componentDidMount() {
    this.state.languages.map((item, index) => {
      if (item.name === this.state.selectLanguage) {
        this.setState({
          current: index
        });
      }
    });
    this.props.addField('language', this.state.selectLanguage);
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  clickLanguage(value) {
    this.setState({
      selectLanguage: value
    });
    this.props.addField('language', value);
  }
  render() {
    const { languages, current, defaultNumber, selectLanguage } = this.state;
    let spanLength = Math.floor(18 / (languages.length > defaultNumber ? defaultNumber : languages.length));

    return (
      <div>
        <h3>Step1</h3>
        <h4>
          Navigation Language <span className="ant-form-item-required"></span>
        </h4>
        <div className="selectLanguage">
          <Row>
            <Col span={3} onClick={() => this.prev()}>
              {current <= 0 ? null : <img className="circleBtn" src={img_left} alt="Left" />}
            </Col>
            {languages &&
              languages.map((item, index) =>
                index >= current && index < current + defaultNumber ? (
                  <Col key={index} span={spanLength} className="language" onClick={() => this.clickLanguage(item.name)}>
                    <div className={selectLanguage === item.name ? 'selected' : null}>
                      <img src={item.description} alt="Image" />
                    </div>
                    <div className="languageName">{item.name}</div>
                  </Col>
                ) : null
              )}
            <Col span={3} onClick={() => this.next()}>
              {this.state.current >= this.state.languages.length - this.state.defaultNumber ? null : <img className="circleBtn" src={img_right} alt="Right" />}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
