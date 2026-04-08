import './Button.css';

function Button({ type = 'button', children, onClick, className = '' }) {
  return (
    <button
      type={type}
      className={`button ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
