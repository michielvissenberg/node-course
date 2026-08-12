// apps/web/src/app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCreateUser, useLogin } from "@/lib/api-hooks.user";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  name: z.string().optional(),
  surname: z.string().optional(),
});

type LoginValues = z.infer<typeof schema>;

function loginErrorMessage(error: unknown): string {
  const statusCode = (error as { statusCode?: number } | null)?.statusCode;
  return statusCode === 401
    ? "Invalid email or password."
    : "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const createUser = useCreateUser();

  const [newUser, setNewUser] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    if (newUser) {
      createUser.mutate({
        name: values.name!,
        surname: values.surname!,
        email: values.email,
        password: values.password,
      }, {
        onSuccess: () => {
          loginMutation.mutate({ email: values.email, password: values.password }, {
            onSuccess: (data) => {
              setToken(data.token);
              router.replace("/users");
            },
          })
        }
      })
    } else {
      loginMutation.mutate({email: values.email, password: values.password}, {
        onSuccess: (data) => {
          setToken(data.token);
          router.replace("/users");
        },
      });
    }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full p-8">
        <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-slate-500">
          Use a seeded account or create a new one (john@example.com / password123)
        </p>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {newUser && (
            <>
              <div>
                <Label htmlFor="string">Name</Label>
                <Input id="name" type="string" {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="string">Surname</Label>
                <Input id="surname" type="string" {...register("surname")} />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
                )}
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {loginMutation.isError && (
            <p className="text-sm text-red-600">
              {loginErrorMessage(loginMutation.error)}
            </p>
          )}
          <div className="flex justify-between">
            <Button type="button" variant="secondary" className="w-full mr-2" onClick={() => {
              const last = newUser;
              setNewUser(!last);
              }}>
              {!newUser && "New user"}
              {newUser && "Existing user"}
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}