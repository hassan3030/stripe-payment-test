import { SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">Sign in to our invoice dashboard</h1>
        <SignInButton forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}