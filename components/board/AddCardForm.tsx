"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Priority } from "@/lib/board-types";

export function AddCardForm({
  title,
  desc,
  priority,
  onTitleChange,
  onDescChange,
  onPriorityChange,
  onCancel,
  onSubmit,
}: {
  title: string;
  desc: string;
  priority: Priority;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onPriorityChange: (v: Priority) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-3 bg-secondary/40 rounded-lg p-3">
      <div className="space-y-2">
        <Label htmlFor="new-title">Title</Label>
        <Input
          id="new-title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onTitleChange(e.target.value)
          }
          placeholder="Card title…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-desc">Description</Label>
        <Textarea
          id="new-desc"
          rows={3}
          value={desc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onDescChange(e.target.value)
          }
          placeholder="Optional details…"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select
          value={priority}
          onValueChange={(v) => onPriorityChange(v as Priority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Add</Button>
      </div>
    </div>
  );
}
