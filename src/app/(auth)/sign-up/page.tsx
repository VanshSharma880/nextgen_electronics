"use client";
import React, { useState } from "react";
import { useRegister } from "@/features/authMutations/useRegister";
import { useRouter } from "next/navigation";
import { IRegisterUser } from "@/types/user.types";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import { Eye, EyeOff } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  userName: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 2 characters"),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, registerLoading } = useRegister();
  const router = useRouter();

  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: IRegisterUser = {
      userName: values.userName,
      email: values.email,
      password: values.password,
    };
    console.log(data);
    register(data, {
      onSuccess: () => router.push("/sign-in"),
    });
  };

  return (
    <section className="flex flex-col items-center pt-2">
      <div className="w-full bg-gray-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-black dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Deo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="JohnDeo@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={registerLoading}
                className="w-full"
              >
                {registerLoading ? <Spinner /> : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-between">
            <span className="border-b w-1/2"></span>
            <div className="text-xs text-center text-gray-500 uppercase">
              or
            </div>
            <span className="border-b w-1/2"></span>
          </div>
          <AuthButton />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              href="/sign-in"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
