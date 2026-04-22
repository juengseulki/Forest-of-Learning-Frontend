import './toast.css';

function Toast({ type = 'info', message, icon }) {
  return (
    <div className={`toast toast--${type}`}>
      {icon ? <span className="toast__icon">{icon}</span> : null}
      <p className="toast__message">{message}</p>
    </div>
  );
}

export default Toast;
