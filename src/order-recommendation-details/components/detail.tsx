import React from 'react';

import { Row, Col, Button } from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import DetailList from './list';

import moment from 'moment';

import { Const, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { bool } from 'prop-types';

@Relax
export default class BillingDetails extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
      setName: IList;
      prescriber: any;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    prescriber: 'prescriber'
  };

  render() {
    const { prescriber } = this.props.relaxProps;
    return (
      <div style={styles.main}>
        <div style={styles.nav}>Select Recommended Product</div>
        <div style={styles.btn}>
          <Button type="primary" shape="round" icon="edit">
            Add Product
          </Button>
        </div>
        <DetailList />
      </div>
    );
  }
}

const styles = {
  main: {
    color: '#000',
    padding: 5,
    marginRight: 10
  },
  nav: {
    color: '#000',
    fontSize: 16,
    padding: 5
  },
  btn: {
    paddingTop: 5
  },
  static: {
    background: '#fff',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
