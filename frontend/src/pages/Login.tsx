import { ArrowRight, Boxes, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

export function Login() {
  const { user, login } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-brand-panel">
        <div className="brand login-brand"><span className="brand-mark">N</span><span>ERPSTAR<span className="brand-sub">ERP PLATFORM</span></span></div>
        <div className="login-pitch"><span className="eyebrow">ONE PLATFORM. YOUR WHOLE BUSINESS.</span><h1>Clarity for every part of your business.</h1><p>Bring your people, inventory, and operations together in one calm, connected workspace.</p></div>
        <div className="login-decoration"><div className="decoration-card"><span className="decoration-icon"><Boxes size={19} /></span><div><strong>Everything in sync</strong><span>Your operations, at a glance</span></div><span className="status-dot" /></div><div className="decoration-orb orb-one" /><div className="decoration-orb orb-two" /></div>
        <span className="login-copyright">© 2025 ERP Systems</span>
      </section>
      <section className="login-form-panel"><div className="login-form-wrap"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p>Enter your credentials to continue to ERPStar.</p>
        <form onSubmit={submit} className="login-form">
          <label className="form-field"><span>Work email</span><input name="email" type="email" placeholder="you@company.com" autoComplete="username" required /></label>
          <label className="form-field"><span>Password</span><input name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary login-submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"} {!submitting && <ArrowRight size={16} />}</button>
        </form><div className="secure-note"><LockKeyhole size={14} /> Your connection is secure and encrypted</div>
      </div><div className="login-help">Need help? <a href="mailto:support@example.com">Contact your administrator</a></div></section>
    </main>
  );
}
