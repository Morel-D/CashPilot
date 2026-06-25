import { AuthLayout } from "../modules/auth/components/Authlayout";
import { RegisterForm } from "../modules/auth/components/ResgiterForm";


export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get your team up and running in minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}