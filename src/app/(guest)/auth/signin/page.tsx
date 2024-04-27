import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/signin/auth.signin";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Đăng nhập SoundClound",
  description: "Music and life",
};
const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  // Nếu user đã đăng nhập thì redirect về homepage
  return (
    <>
      <AuthSignIn />
    </>
  );
};

export default SignInPage;
