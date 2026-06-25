import { AuthLayout } from '../modules/auth/components/Authlayout';
import { LoginForm } from '../modules/auth/components/Loginform';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CashPilot account."
    >
      <LoginForm />
    </AuthLayout>
  );
}