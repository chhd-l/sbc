import React from 'react';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SearchForm from './components/SearchForm';
import SkuMappingList from './components/SkuMappingList';

import { FormattedMessage } from 'react-intl';

import './index.less';
import {Spin} from 'antd';

export default class ProductSkuMapping extends React.Component<any, any> {
    form: any
    constructor(props) {
        super(props);
        this.state = {
            listArr: []
        }
    }

    componentDidMount() {
        //
        let values = this.form.getFieldsValue();
        this.getListData(values);
    }

    // 初始化列表
    getListData = (values) => {
        setTimeout(() => {
            this.setState({
                listArr: []
            })
        }, 1500)
    }

    render() {
        let {listArr} = this.state;
        return (
            // <AuthWrapper functionName="f_goods_skuMapping">
            //     <div>
            //         <BreadCrumb />
            //         <div className="container-search">
            //             <Headline title={<FormattedMessage id="Product.SkuMapping" />} />
            //             <SearchForm />
            //         </div>
            //         <div className="container">
            //
            //         </div>
            //     </div>
            // </AuthWrapper>
            <div className='ProductSkuMapping-wrap'>
                <BreadCrumb />
                <div className="container-search">
                    <Headline title={<FormattedMessage id="Product.SkuMapping" />} />
                    <SearchForm
                        wrappedComponentRef={(form) => this.form = form}
                        onSearch={this.getListData}
                    />
                </div>
                <div className="container">
                    <Spin>
                        <SkuMappingList
                            data={listArr}
                            getListData={this.getListData}
                        />
                    </Spin>

                </div>
            </div>
        );
    }
}
