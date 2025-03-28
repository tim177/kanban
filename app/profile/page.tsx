import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ProfileForm from "@/components/profile/profile-form";
import { getUserById } from "@/lib/user-service";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
