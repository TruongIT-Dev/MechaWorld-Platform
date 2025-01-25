import React from 'react';
import ReactDOM from 'react-dom';
import NotificationSystem from 'react-notification-system';

export default class Notification  extends React.Component {
  notificationSystem = React.createRef();

  addNotification = event => {
    event.preventDefault();
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: 'Notification message',
      level: 'success'
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.addNotification}>Add notification</button>
        <NotificationSystem ref={this.notificationSystem} />
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(MyComponent),
  document.getElementById('app')
);