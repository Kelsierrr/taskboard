"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 space-y-6 text-center min-h-[560px]  flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">TB</span>
          </div>
          <h1 className="text-3xl font-bold">TaskBoard</h1>
        </div>

        <p className="text-muted-foreground">
          Modern team project management with drag-and-drop boards
        </p>

        <div className="space-y-3 pt-4">
<Button className="w-full" onClick={() => router.push("/auth?tab=login")}>
  Sign In
</Button>

<Button variant="outline" className="w-full" onClick={() => router.push("/auth?tab=register")}>
  Create Account
</Button>
        </div>
      </Card>
    </main>
  );
}
