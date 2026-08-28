import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/nav/Sidebar";
import { MobileTopBar } from "@/components/nav/MobileTopBar";
import { BottomTabBar } from "@/components/nav/BottomTabBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.status !== "ACTIVE") redirect("/login");

  const { role, name, userUid } = session.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} userName={name ?? userUid} userUid={userUid} />
      <MobileTopBar role={role} userName={name ?? userUid} userUid={userUid} />

      <main className="pb-20 md:ml-60 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
      </main>

      <BottomTabBar />
    </div>
  );
}
