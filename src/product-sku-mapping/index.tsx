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
            loading: false,
            listParams: {
                pageNum: 0,
                pageSize: 10,
            }

        }
    }

    componentDidMount() {
        let {
            listParams
        } = this.state;
        this.getListData(listParams);
    }

    // 获取列表数据
    getListData = (params) => {
        let listParams = {
            ...this.state.listParams,
            ...params,
        }
        this.setState({ loading: true})
        setTimeout(() => {
            this.setState({
                listArr: [{
                    id: 1,
                    productName: 123,
                    SPU: 234234,
                    SKU: 23423,
                    ExternalSKU: 234234
                }],
                loading: false,
                listParams,
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
            <AuthWrapper functionName='f_goods_skuMapping'>
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
            </AuthWrapper>

        );
    }
}
