import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authz";
import { listUsers } from "@/lib/data/users";
import { createUser, deactivateUser, reactivateUser } from "@/lib/actions/users";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { UserForm } from "@/components/forms/UserForm";

export default async function UsersPage() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await listUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Users</h1>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Add advisor / admin</h2>
        <UserForm action={createUser} />
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">All users</h2>
        <ul className="divide-y divide-gray-100">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.userUid} · {user.role} ·{" "}
                  <span className={user.status === "ACTIVE" ? "text-green-600" : "text-gray-400"}>{user.status}</span>
                </p>
              </div>
              {user.id !== session.user.id && (
                <div className="text-xs font-medium">
                  {user.status === "ACTIVE" ? (
                    <ConfirmForm action={deactivateUser.bind(null, user.id)} confirmMessage="Deactivate this user?" className="text-red-600">
                      Deactivate
                    </ConfirmForm>
                  ) : (
                    <ConfirmForm action={reactivateUser.bind(null, user.id)} confirmMessage="Reactivate this user?" className="text-blue-600">
                      Reactivate
                    </ConfirmForm>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
