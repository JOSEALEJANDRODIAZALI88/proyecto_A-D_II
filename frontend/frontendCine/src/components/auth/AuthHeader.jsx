export default function AuthHeader() {
  return (
    <div className="login-logo">
      <div className="login-logo-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
        </svg>
      </div>

      <div className="login-title-box">
        <span className="login-brand">Cine Verde</span>
        <span className="login-heading">Bienvenido</span>
      </div>
    </div>
  );
}