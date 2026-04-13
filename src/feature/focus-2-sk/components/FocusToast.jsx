import './FocusToast.css';

function FocusToast({ type = 'info', message, icon }) {
  return (
    <div className={`focus-toast focus-toast--${type}`}>
      {icon ? <span className="focus-toast__icon">{icon}</span> : null}
      <p className="focus-toast__message">{message}</p>
    </div>
  );
}

export default FocusToast;
