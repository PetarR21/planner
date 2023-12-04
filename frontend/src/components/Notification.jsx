/* eslint-disable react/prop-types */
const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }

  return <div className='notification'>{notification.message}</div>;
};

export default Notification;
