import axios from "axios";
import { authClient } from "./auth-client";

interface handleWorkspaceSetupProp {
  workSpace_name: string;
  workSpace_Url: string;
}

export const handleGithubAuth = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "http://localhost:3001/onboarding/welcome",
  });
};

export const handleGoogleAuth = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:3001/onboarding/welcome",
  });
};

export const handleWorkspaceSetup = async ({
  workSpace_name,
  workSpace_Url,
}: handleWorkspaceSetupProp) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/onboarding/workspace-setup",
      {
        workSpace_name,
        workSpace_Url,
      },
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error ?? "Something went wrong",
      };
    }

    return {
      error: "Something went wrong",
    };
  }
};
