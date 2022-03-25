import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import {FormattedMessage} from 'react-intl';
import { RCi18n } from 'qmkit';

const styles = {
    label: {
        width: 151,
        textAlign: 'center'
    },
    wrapper: {
        width: 177
    }
} as any;

// @ts-ignore
@Form.create()
export default class SearchForm extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onSearch({
                    pageNum: 0,
                    pageSize: 10,
                    ...values,
                });
            }
        });
    };

    render() {
        let {
            getFieldDecorator,
        } = this.props.form;

        return (
            <div>
                <Form
                    onSubmit={this.handleSubmit}
                    className="filter-content"
                    layout="inline"
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item>
                                {
                                    getFieldDecorator('productName')(
                                        <Input
                                            addonBefore={
                                                <p style={styles.label} title={RCi18n({id:'Product.productName'})}>
                                                    <FormattedMessage id="Product.productName" />
                                                </p>
                                            }
                                            style={{ width: 351 }}
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                {
                                    getFieldDecorator('spu')(
                                        <Input
                                            addonBefore={
                                                <p style={styles.label} title={RCi18n({id:'Product.SPU'})}>
                                                    <FormattedMessage id="Product.SPU" />
                                                </p>
                                            }
                                            style={{ width: 351 }}
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                {
                                    getFieldDecorator('sku')(
                                        <Input
                                            addonBefore={
                                                <p style={styles.label} title={RCi18n({id:'Product.SKU'})}>
                                                    <FormattedMessage id="Product.SKU" />
                                                </p>
                                            }
                                            style={{ width: 351 }}
                                        />
                                    )
                                }
                            </Form.Item>

                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                {
                                    getFieldDecorator('externalSku')(
                                        <Input
                                            addonBefore={
                                                <p style={styles.label} title={RCi18n({id:'Product.ExternalSKU'})}>
                                                    <FormattedMessage id="Product.ExternalSKU" />
                                                </p>
                                            }
                                            style={{ width: 351 }}
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon="search"
                                    shape="round"
                                >
                                    <FormattedMessage id="Product.search" />
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}