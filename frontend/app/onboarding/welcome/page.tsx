import { Welcome } from "@/components/pages/onboarding/welcome";
import { getSession } from "@/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (session) {
    const { user, workspaceCount } = session;
    if (workspaceCount > 0) {
      redirect("/workspaces");
    } else if (!user.firstLogin) {
      redirect("/onboarding/workspace-setup");
    }

  }

  return (
    <div>
      <Welcome />
    </div>
  );
}

