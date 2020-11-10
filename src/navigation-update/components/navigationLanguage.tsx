import React, { Component } from 'react';
import * as webapi from '../webapi';
import { message, Row, Col, Icon } from 'antd';
import { couldStartTrivia } from 'typescript';
import PropTypes from 'prop-types';

export default class NavigationLanguage extends React.Component<any, any> {
  static propTypes = {
    navigation: PropTypes.object
  };
  static defaultProps = {
    navigation: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      current: 0,
      defaultNumber: 3,
      selectLanguage: this.props.navigation.language
    };
    this.getLanguages = this.getLanguages.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.clickLanguage = this.clickLanguage.bind(this);
  }

  componentDidMount() {
    this.getLanguages();
  }

  getLanguages() {
    webapi
      .querySysDictionary({ type: 'Language' })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let languages = [...res.context.sysDictionaryVOS];
          this.setState({
            languages
          });
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
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
            <Col span={3} className="circleBtn" onClick={() => this.prev()}>
              {current <= 0 ? null : <Icon type="left-circle" />}
            </Col>
            {languages &&
              languages.map((item, index) =>
                index >= current && index < current + defaultNumber ? (
                  <Col key={index} span={spanLength} className="language" onClick={() => this.clickLanguage(item.valueEn)}>
                    <div className={selectLanguage === item.valueEn ? 'selected' : null}>
                      <img src={item.description} alt="Image" />
                    </div>
                    <div className="languageName">{item.name}</div>
                  </Col>
                ) : null
              )}
            <Col span={3} className="circleBtn" onClick={() => this.next()}>
              {this.state.current >= this.state.languages.length - this.state.defaultNumber ? null : <Icon type="right-circle" />}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
