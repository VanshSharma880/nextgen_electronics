import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogin = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      return res;
    },

    onSuccess: () => {
      toast.success("User login successful");
      router.push("/");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Failed to login. Please try again..."
      );
    },
  });

  return {
    login: mutate,
    loginPending: isPending,
  };
};

export const useLogout = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Failed to logout. Please try again..."
      );
    },
  });
  return {
    logout: mutate,
    isLogoutPending: isPending,
    isLogoutError: isError,
  };
};
