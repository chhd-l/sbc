import React from 'react';
import { message } from "antd";



export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, text: '' };
  }

  componentDidCatch(error, info) {


    console.log(error, info,'-------------------')
    alert('错误发生的位置：' + info.componentStack) //错误信息error.message, 错误堆栈error.stack, 组件堆栈info.componentStack


    // Display fallback UI
    this.setState({
      hasError: true,
      text: info.componentStack
    });

    // You can also log the error to an error reporting service
    message.error(error, info);

  }

  render() {
    console.log(this.state.hasError,'this.state.hasError')
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // return <h1>Something went wrong.</h1>;
      return (
        <div>
          <h1>错误是：{this.state.error.toString()}</h1>
          <h2>错误出现的位置是：{this.state.text}</h2>
          {/* <img src="https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2942945378,442701149&fm=26&gp=0.jpg" /> */}
        </div>
      )
    }
    return this.props.children;
  }


}
