import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";

export default function AuthPanel() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    remember: true
  });

  const updateField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="auth-card">
      <div className="auth-heading">
        <span className="eyebrow">WELCOME TO NEXA</span>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p>
          {mode === "login"
            ? "Sign in to continue to your workspace and pick up where you left off."
            : "Join a focused workspace designed to keep your projects moving."}
        </p>
      </div>

      <div className="segmented-control">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>

        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className="field">
            <span>Full name</span>
            <div className="input-shell">
              <UserRound size={18} />
              <input
                value={form.name}
                onChange={updateField("name")}
                placeholder="Muhammad Abdullah"
              />
            </div>
          </label>
        )}

        <label className="field">
          <span>Email address</span>
          <div className="input-shell">
            <Mail size={18} />
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-shell">
            <LockKeyhole size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={updateField("password")}
              placeholder="At least 8 characters"
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="form-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={updateField("remember")}
            />
            <span>{mode === "login" ? "Remember me" : "I agree to the terms"}</span>
          </label>

          {mode === "login" && (
            <button className="text-button" type="button">
              Forgot password?
            </button>
          )}
        </div>

        <button className="primary-button" type="submit">
          <span>{mode === "login" ? "Sign in" : "Create account"}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="divider"><span>or continue with</span></div>

      <div className="social-grid">
        <button className="social-button" type="button"><b>G</b> Google</button>
        <button className="social-button" type="button"><b>◈</b> GitHub</button>
      </div>

      <p className="fine-print">
        By continuing, you agree to Nexa's Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}