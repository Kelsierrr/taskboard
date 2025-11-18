"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

type PasswordFieldProps = React.ComponentProps<typeof Input> & { id: string };

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="relative">
        <Input id={id} ref={ref} type={show ? "text" : "password"} {...props} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTab = (params.get("tab") === "register" ? "register" : "login") as
    | "login"
    | "register";
  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // LOGIN FORM
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@taskboard.com",
      password: "password123",
    },
  });

  // REGISTER FORM
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "Demo User",
      email: "demo@taskboard.com",
      password: "password123",
      confirm: "",
    },
  });
  const registerPasswordWatch = watch("password");

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await api("/auth/login", { method: "POST", body: data });
      router.push("/dashboard");
    } catch (e: any) {
     const msg = e?.message?.toLowerCase?.().includes("fetch")
     ? "Couldn’t reach the server, please try again."
     : e?.message || "Login failed";
      alert(msg);
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      await api("/auth/register", { method: "POST", body: data });
      router.push("/dashboard");
    } catch (e: any) {
      alert(e?.message || "Registration failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg grid place-items-center">
              <span className="text-primary-foreground font-bold">TB</span>
            </div>
            <h1 className="text-2xl font-bold">TaskBoard</h1>
          </div>
          <p className="text-sm text-muted-foreground">Modern team project management</p>
        </div>

        {/* Keep card height consistent with a single min-height wrapper */}
        <div className="mt-2 min-h-[420px]">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" {...loginRegister("email")} />
                  {loginErrors.email && (
                    <p className="text-xs text-destructive">{loginErrors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <PasswordField id="login-password" {...loginRegister("password")} />
                  {loginErrors.password && (
                    <p className="text-xs text-destructive">{loginErrors.password.message}</p>
                  )}
                  {/* right-aligned forgot link */}
                  <div className="flex justify-end">
                    <a href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loginSubmitting}>
                  {loginSubmitting ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordField id="password" {...register("password")} />
                  {registerPasswordWatch && registerPasswordWatch.length > 0 && registerPasswordWatch.length < 8 && (
  <p className="text-xs text-destructive">At least 8 characters</p>
)}
{errors.password && (
  <p className="text-xs text-destructive">{errors.password.message}</p>
)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <PasswordField id="confirm" {...register("confirm")} />
                  {errors.confirm && (
                    <p className="text-xs text-destructive">{errors.confirm.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </main>
  );
}
