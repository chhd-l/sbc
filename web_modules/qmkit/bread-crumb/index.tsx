import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { cache } from '../index';
import { fromJS } from 'immutable';
import { RCi18n } from '../lang';

export default class BreadCrumb extends React.Component<any, any> {
  props: {
    first?: string;
    second?: string;
    third?: string;
    children?: any;
    //自动化几个层级，默认3个，即3个层级的自动显示，最少应该是2个层级
    //自动显示2个层级的，传2，后面的层级由页面处理，作为children传递
    autoLevel?: number;
    //页面中添加层级
    thirdLevel?: boolean;
  };

  render() {
    //选中的一级菜单索引
    const firstIndex = sessionStorage.getItem(cache.FIRST_ACTIVE) || '0';
    //选中的二级菜单索引
    const secondIndex = sessionStorage.getItem(cache.SECOND_ACTIVE) || '0';
    //选中的三级菜单索引
    const thirdIndex = sessionStorage.getItem(cache.THIRD_ACTIVE) || '0';
    //所有菜单
    const allGradeMenus = fromJS(JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS)));
    let first = allGradeMenus.get(firstIndex).get('title') || '';
    let firstUrl = allGradeMenus.getIn([firstIndex, 'children']) ? (allGradeMenus.getIn([firstIndex, 'children', 0, 'children', 0, 'url']) || '') : allGradeMenus.getIn([firstIndex, 'url']);

    let second = allGradeMenus.getIn([firstIndex, 'children']) ? (allGradeMenus.get(firstIndex).get('children').get(secondIndex).get('title') || '') : '';
    let third = second ? (allGradeMenus.get(firstIndex).get('children').get(secondIndex).get('children').get(thirdIndex).get('title') || '') : '';
    let thirdUrl = third ? (allGradeMenus.getIn([firstIndex, 'children', secondIndex, 'children', thirdIndex, 'url']) || '') : '';

    const firstMenuName = first ? RCi18n({id:`Menu.${first}`}) : first;
    const thirdMenuName = third ? RCi18n({id:`Menu.${third}`}) : third;

    return (
      <Breadcrumb>
        {first !== '' && <Breadcrumb.Item>
          <Link to={firstUrl}>{firstMenuName}</Link>
        </Breadcrumb.Item>}
        {third !== '' && <Breadcrumb.Item>{this.props.thirdLevel ? <Link to={thirdUrl}>{thirdMenuName}</Link> : thirdMenuName}</Breadcrumb.Item>}
        {this.props.children}
      </Breadcrumb>
    );
  }
}
