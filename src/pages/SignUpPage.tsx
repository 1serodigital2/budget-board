import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import { Field, Input } from "../components/form/Fields";
import Button, { ButtonLink } from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { Alert } from "../components/ui/States";
import { getErrorMessage } from "../utils/helpers";

const MIN_PASSWORD = 8;

const SignUpPage = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const passwordError =
    touched && password.length < MIN_PASSWORD
      ? `Use at least ${MIN_PASSWORD} characters`
      : undefined;
  const confirmError =
    touched && confirm !== password ? "Passwords don't match" : undefined;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (password.length < MIN_PASSWORD || confirm !== password) return;

    setSubmitting(true);
    try {
      const { needsConfirmation } = await signUp(email, password);
      // Without email confirmation the user is signed in and redirected.
      if (needsConfirmation) setSentTo(email.trim());
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create your account"));
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        description={
          <>
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{sentTo}</span>. Click it to
            activate your account, then sign in.
          </>
        }
      >
        <div className="flex flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-card">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="mark_email_read" size={28} />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn't get it? Check your spam folder, or try again in a minute.
          </p>
          <ButtonLink to="/login" className="mt-6 w-full" size="lg">
            Go to sign in
          </ButtonLink>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start tracking expenses and budgets in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}
        <Field id="email" label="Email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field
          id="password"
          label="Password"
          hint={`At least ${MIN_PASSWORD} characters`}
          error={passwordError}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            invalid={!!passwordError}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field id="confirm" label="Confirm password" error={confirmError}>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            invalid={!!confirmError}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
