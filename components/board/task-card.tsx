"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";

export type Priority = "low" | "medium" | "high";
export type Task = { id: string; title: string; description: string; priority: Priority };

export function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (t: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);

  const color =
    priority === "high"
      ? "bg-red-500/15 text-red-600"
      : priority === "medium"
      ? "bg-yellow-500/15 text-yellow-700"
      : "bg-emerald-500/15 text-emerald-700";

  function save() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate({ ...task, title: trimmed, description: desc, priority });
    setOpen(false);
  }

  return (
    <>
      <Card
        className="p-3 cursor-pointer hover:shadow-sm transition"
        draggable
        onClick={() => setOpen(true)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{task.title}</p>
            {task.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
            ) : null}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded self-start ${color}`}>
            {task.priority}
          </span>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="t-title">Title</Label>
              <Input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="t-desc">Description</Label>
              <Textarea id="t-desc" rows={3} value={desc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDesc(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue placeholder="Pick priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="justify-between gap-2">
            <Button variant="destructive" onClick={() => { onDelete(task.id); setOpen(false); }}>
              Delete
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
