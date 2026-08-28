import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Advisor Pro</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in with your advisor ID</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
