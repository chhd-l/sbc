import React from 'react';
import { Icon, Button } from 'antd';
import { Headline } from 'qmkit';

class FeedBack extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMore: false
    };
  }

  showMore = (stat: boolean) => {
    this.setState({
      showMore: stat
    });
  };

  render() {
    const { showMore } = this.state;
    return (
      <div className="detail-container">
        <div
          onClick={() => {
            this.showMore(!showMore);
          }}
        >
          <Headline
            title="Feedback"
            extra={
              <div>
                {showMore && <Button type="link">Edit</Button>}
                <Icon type={showMore ? 'up' : 'down'} />
              </div>
            }
          />
        </div>
        <div>fjkdlsajfd</div>
      </div>
    );
  }
}

export default FeedBack;
