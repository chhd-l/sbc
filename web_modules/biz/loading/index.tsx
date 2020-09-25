import React from 'react';

/**
 * 预览图片
 */
export default class Loading extends React.Component<any, any> {
    render() {
        return (
            <div className="loadingAnimation">
                <span>L</span>
                <span>o</span>
                <span>a</span>
                <span>d</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>
        );
    }
}
