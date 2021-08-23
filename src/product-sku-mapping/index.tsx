import React from 'react';
import {Headline, AuthWrapper, BreadCrumb, Const} from 'qmkit';
import SearchForm from './components/SearchForm';
import SkuMappingList from './components/SkuMappingList';
import { FormattedMessage } from 'react-intl';
import { getSkuMappingList } from './webapi';

import './index.less';

export default class ProductSkuMapping extends React.Component<any, any> {
    form: any
    constructor(props) {
        super(props);
        this.state = {
            mappingPage: {
                content: [],
                total: 0,
                number: 0,
            },
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
    getListData = async (listParams) => {
        // 获取form表单数据
        let formData = this.form.props.form.getFieldsValue();
        let params = {
            ...this.state.listParams,
            ...formData,
            ...listParams,
        }
        this.setState({ loading: true})
        let {res} = await getSkuMappingList(params);
        this.setState({ loading: false})
        if(res.code === Const.SUCCESS_CODE){
            let {mappingPage} = res.context;
            this.setState({
                mappingPage,
                listParams: params // 记录参数
            })
        }

    }

    render() {
        let {
            loading,
            mappingPage,
        } = this.state;
        // @ts-ignore
        return (
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
                        data={mappingPage}
                        getListData={this.getListData}
                    />
                </div>
            </div>

            // <AuthWrapper functionName='f_goods_skuMapping'>
            //     <div className='ProductSkuMapping-wrap'>
            //         <BreadCrumb />
            //         <div className="container-search">
            //             <Headline title={<FormattedMessage id="Product.SkuMapping" />} />
            //             <SearchForm
            //                 wrappedComponentRef={(form) => this.form = form}
            //                 onSearch={this.getListData}
            //             />
            //         </div>
            //         <div className="container">
            //             <SkuMappingList
            //                 loading={loading}
            //                 data={listArr}
            //                 getListData={this.getListData}
            //             />
            //         </div>
            //     </div>
            // </AuthWrapper>
        );
    }
}
