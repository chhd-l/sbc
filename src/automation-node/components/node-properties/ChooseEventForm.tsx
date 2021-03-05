import React, { Component } from 'react'
import { Form, Row, Col, Input, TreeSelect } from 'antd';

const FormItem = Form.Item;

export default class ChooseEventForm extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
      }
    render() {
       const treeData=[

       ]
        return (
            <FormItem label="Choose an event" colon={false}>
                <TreeSelect
                    placeholder="Please select a event"
                    style={{width: '100%'}}
                    dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                    treeData={treeData}
                    treeDefaultExpandAll
                    showSearch
                    allowClear
                    searchPlaceholder="Search"
                    >
                    </TreeSelect>
            </FormItem>
        )
    }
}
