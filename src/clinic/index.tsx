import React, { Component } from 'react';
import { Headline } from 'qmkit';
import SearchForm from './components/search-form';
import List from './components/list';

export default class ClinicList extends Component<any, any> {
  render() {
    return (
      <div className="container">
        <Headline title="Clinic List" />
        {/*搜索条件*/}
        <SearchForm />
        <List />
      </div>
    );
  }
}
