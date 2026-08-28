import { getCurrentUser } from "@/lib/data/users";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
      <p className="-mt-4 text-sm text-gray-500">
        {user.userUid} · {user.role}
      </p>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Profile details</h2>
        <ProfileForm user={user} />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
