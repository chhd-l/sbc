
// nodes 三种节点

// edges 二种边

const mainNode = {
    id: 'mainNode',
    x: 400,
    y: 200,
    width: 125,
    height: 125,
    label: 'FGS',
    attrs: {
        body: {
            fill: '#e2001a',
            stroke: '#e2001a',
            rx: 5,
            ry: 5,
        },
        label: {
            fill: '#333',
            fontSize: 18,
            fontWeight: 'bold',
        },
    },
}

const node1 = {
    id: 'node1',
    x: 0,
    y: 0,
    width: 80,
    height: 40,
    label: 'WeSahre',
    attrs: {
        body: {
            fill: '#999',
            stroke: '#999',
            rx: 5,
            ry: 5,
        },
        label: {
            fill: '#333',
            fontSize: 16,
            fontWeight: 'bold',

        },
    },

}

const node2 = {
    id: 'node2',
    x: 400,
    y: 500,
    width: 180,
    height: 40,
    label: 'world',
    attrs: {
        body: {
            fill: '#999',
            stroke: '#999',
            rx: 5,
            ry: 5,
        },
        label: {
            fill: '#333',
            fontSize: 16,
            fontWeight: 'bold',

        },
    },

}

const data = {
    // 节点
    nodes: [
      mainNode,
        node1,
        node2,
    ],
    // 边
    edges: [
        {
            source: 'node1', // String，必须，起始节点 id
            target: 'mainNode', // String，必须，目标节点 id
        },
        {
            source: 'node2', // String，必须，起始节点 id
            target: 'mainNode', // String，必须，目标节点 id
        },
    ],
};

export default data;