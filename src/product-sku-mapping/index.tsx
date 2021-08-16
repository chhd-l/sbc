import React from 'react';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SearchForm from './components/SearchForm';
import SkuMappingList from './components/SkuMappingList';
import { FormattedMessage } from 'react-intl';

import './index.less';

export default class ProductSkuMapping extends React.Component<any, any> {
    form: any
    constructor(props) {
        super(props);
        this.state = {
            listArr: [],
            loading: false
        }
    }

    componentDidMount() {
        let initValue = {}
        this.getListData(initValue);
    }

    // 初始化列表
    getListData = (values) => {
        this.setState({ loading: true})
        setTimeout(() => {
            this.setState({
                listArr: [],
                loading: false,
            })
        }, 1500)
    }

    render() {
        let {
            loading,
            listArr,
        } = this.state;
        // @ts-ignore
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
                    <SkuMappingList
                        loading={loading}
                        data={listArr}
                        getListData={this.getListData}
                    />
                </div>
            </div>
        );
    }
}
