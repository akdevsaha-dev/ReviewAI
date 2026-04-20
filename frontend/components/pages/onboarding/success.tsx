"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { handleOnboardingComplete } from "@/lib/actions";


export const Success = () => {
  const workspaceId = useSearchParams().get("workspaceId");
  const workspaceName = useSearchParams().get("workspaceName");
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="text-3xl">You&apos;re good to go</div>

      <div className="text-center px-10 mt-5">
        Go ahead and explore the app. When you&apos;re ready, submit a pr in
        github
      </div>

      <div className="w-[60%] h-52 border border-neutral-800 flex mt-5">
        <div className="flex-1 flex flex-col items-center justify-center border-r border-neutral-800 px-4 text-center">
          <div className="text-lg font-medium">1. Repository Connected</div>
          <div className="text-sm text-neutral-400 mt-2">
            Your GitHub repository has been successfully linked to this
            workspace.
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            PRwise will now track pull requests from this repository
            automatically.
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center border-r border-neutral-800 px-4">
          <div className="text-lg font-medium">2. Open a Pull Request</div>
          <div className="text-sm text-neutral-400 mt-2">
            Push your changes and create a pull request in your repository.
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            PRwise will instantly analyze the changes in your pull request.
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="text-lg font-medium">3. Get AI Code Reviews</div>
          <div className="text-sm text-neutral-400 mt-2">
            Receive AI-powered feedback, suggestions, and improvement tips.
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Ship cleaner code and merge pull requests with confidence.
          </div>
        </div>
      </div>

      <button
        onClick={async () => {
          await handleOnboardingComplete();
          router.push(
            `/dashboard/${workspaceName}/${workspaceId}/?connected=github`,
          );
        }}
        className="w-67.5 h-12 flex hover:cursor-pointer items-center justify-center bg-neutral-800 mt-16 rounded-md"
      >
        Open PRwise
      </button>

    </div>
  );
};
