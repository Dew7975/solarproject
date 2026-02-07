import LoginClient from "./LoginClient";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string; suspended?: string };
}) {
  const redirect = searchParams?.redirect ?? "/customer/dashboard";
  const suspended = searchParams?.suspended === "1";

  return <LoginClient redirect={redirect} suspended={suspended} />;
}