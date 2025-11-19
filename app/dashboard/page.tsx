"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  loadBoards,
  loadBoardData,
  saveBoards,
  saveBoardData,
  uid,
  type StoredBoardMeta,
} from "@/lib/storage";

export default function DashboardPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<StoredBoardMeta[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // load boards on mount
  useEffect(() => {
    setBoards(loadBoards());
  }, []);

  // keep in sync if localStorage changes (e.g. board deleted from board page)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "taskboard_boards") {
        setBoards(loadBoards());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // compute real totals from localStorage
  const totals = useMemo(() => {
    let taskCount = 0;

    for (const b of boards) {
      const data = loadBoardData(b.id);
      if (data?.lists) {
        for (const list of data.lists) {
          taskCount += list.tasks?.length ?? 0;
        }
      }
    }

    return {
      boards: boards.length,
      tasks: taskCount,
    };
  }, [boards]);

  function createBoard() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const id = uid();
    const meta: StoredBoardMeta = {
      id,
      name: trimmed,
      description: desc.trim() || undefined,
    };

    const next = [meta, ...boards];
    setBoards(next);
    saveBoards(next);

    // seed board data with default empty lists
    saveBoardData(id, {
      name: meta.name,
      description: meta.description,
      lists: [
        { id: uid(), title: "To Do", tasks: [] },
        { id: uid(), title: "In Progress", tasks: [] },
        { id: uid(), title: "Done", tasks: [] },
      ],
    });

    setOpen(false);
    setName("");
    setDesc("");
    router.push(`/board/${id}`);
  }

  return (
    <main className="min-h-screen px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your boards and work-in-progress.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />New Board
        </Button>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mt-6">
        <StatCard label="Boards" value={totals.boards} />
        <StatCard label="Tasks" value={totals.tasks} />
        <StatCard label="Team Members" value="—" comingSoon />
        <StatCard label="Active Sprints" value="—" comingSoon />
      </section>

      {/* Boards list */}
      <section className="max-w-6xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-3">Boards</h2>
        {boards.length === 0 ? (
          <EmptyBoards onNew={() => setOpen(true)} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
          </div>
        )}
      </section>

      {/* New Board Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="b-name">Name</Label>
              <Input
                id="b-name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Website Redesign"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-desc">Description (optional)</Label>
              <Input
                id="b-desc"
                value={desc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDesc(e.target.value)
                }
                placeholder="Short description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createBoard}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function StatCard({
  label,
  value,
  comingSoon = false,
}: {
  label: string;
  value: number | string;
  comingSoon?: boolean;
}) {
  return (
    <Card
      className={`p-5 flex flex-col justify-between ${
        comingSoon ? "opacity-70 border-dashed" : ""
      }`}
    >
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      {comingSoon && (
        <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wide">
          Coming soon
        </p>
      )}
    </Card>
  );
}

function EmptyBoards({ onNew }: { onNew: () => void }) {
  return (
    <Card className="p-8 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center mb-3">
        <Plus className="size-5 text-primary" />
      </div>
      <h3 className="font-semibold mb-1">No boards yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create your first board to get started.
      </p>
      <Button variant="outline" onClick={onNew}>
        Create Board
      </Button>
    </Card>
  );
}

function BoardCard({ board }: { board: StoredBoardMeta }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow h-full">
      <Link href={`/board/${board.id}`} className="block focus:outline-none">
        <div className="h-1 bg-primary rounded-full mb-4" />
        <h3 className="text-lg font-semibold mb-1">{board.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {board.description}
        </p>
      </Link>
    </Card>
  );
}
