export default function AuthInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>

      <div className="field-wrap">
        <span className="field-icon">
          {icon === "email" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </span>

        <input
          type={type}
          placeholder={placeholder}
          className="field-input"
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}