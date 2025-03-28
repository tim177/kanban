import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import type { User as UserType } from "@/lib/types";

export async function getUserById(id: string): Promise<UserType | null> {
  try {
    await connectToDatabase();
    const user = await User.findById(id).select("-password");

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string }
): Promise<UserType | null> {
  try {
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    ).select("-password");

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}
