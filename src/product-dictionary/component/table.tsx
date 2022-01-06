import React from 'react';
import { Table, Spin } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table/interface';

type Result = {
  content: any[]
  total: string | number
  last: string | number
}

interface TablePageProps extends TableProps<any> {
  searchFunc: (any) => Promise<false | Result>
  columns: ColumnProps<any>[];
  initLoad?: Boolean
  onFetchEnd?: (any) => void
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * @description Table列表查询绑定以下参数即可使用 页面demo 参考 /product-dictionary
 *
 * @param searchFunc 查询列表 promise函数
 * @param columns table栏目设置
 * @param initLoad? 初始化是否自动加载列表
 * @param onFetchEnd? 每次请求回调
 *
 */

export default class TablePage extends React.Component<TablePageProps> {
  state = {
    loading: false,
    searchList: [],
    searchParams: {},
    total: 0,
    pageNum: 0,
    pageSize: DEFAULT_PAGE_SIZE
  };

  componentDidMount() {
    this.props.initLoad && this.search();
  }

  search = (params = {}) => {
    const { pageNum, pageSize } = this.state;

    const searchParams = Object.assign({}, this.state.searchParams, params, {
      pageNum,
      pageSize
    });

    this.setState(
      {
        searchParams: searchParams
      },
      () => {
        this.getData();
      }
    );
  };

  resetSearch = (params) => {
    const searchParams = Object.assign({}, this.state.searchParams, params, {
      pageNum: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });

    this.setState(
      {
        searchParams: searchParams,
        total: 0,
        pageNum: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        last: false
      },
      () => {
        this.getData();
      }
    );
  };

  getData = () => {
    this.setState({
      loading: true
    });
    this.props
      .searchFunc(this.state.searchParams)
      .then((result) => {
        const data = result;

        if (data) {
          const { content = [], total, last } = data;
          this.setState({
            searchList: content,
            total: total,
            last: last
          });
          this.props.onFetchEnd?.(data);
          this.redirectPrev(content, total);
        }

        this.setState({
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  handleSizeChange = (current, pageSize) => {
    this.setState(
      {
        pageSize: pageSize
      },
      () => {
        this.search();
      }
    );
  };

  handleCurrentChange = ({ current }) => {
    this.setState(
      {
        pageNum: current - 1
      },
      () => {
        this.search();
      }
    );
  };

  redirectPrev = (content, total) => {
    if (content.length === 0 && total > 0 && this.state.pageNum > 0) {
      this.handleCurrentChange({ current: this.state.pageNum });
    }
  };

  render() {
    const { columns, rowKey = 'id', ...props } = this.props;
    const { searchList, loading, pageNum, pageSize, total } = this.state;
    const pagination = {
      current: pageNum + 1,
      pageSize,
      total
    };

    return (
      <div className='table-page'>
        <Spin spinning={loading}>
          <Table
            {...props}
            rowKey={rowKey}
            dataSource={searchList}
            columns={columns}
            pagination={pagination}
            onChange={this.handleCurrentChange}
          />
        </Spin>
      </div>
    );
  }
}