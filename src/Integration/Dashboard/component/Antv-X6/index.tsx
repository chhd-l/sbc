import React, { Component} from 'react';
import { Graph } from '@antv/x6';
import data from './data';

import './index.less';

export default class AntvX6 extends Component<any, any>{
    private graph: Graph;
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //
        this.graph = new Graph({
            container: document.getElementById('container'),
            width: 800,
            height: 600,
            panning: true,
            snapline: true,
        });

        this.graph.fromJSON(data);
        this.graph.centerContent();
    }

    render() {
        return (
            <div className='AntvX6-wrap'>
                <div id="container"/>
            </div>
        );
    }
}