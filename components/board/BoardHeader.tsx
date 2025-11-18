"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BoardHeader({
  name, description,
  addingList, listTitle,
  onStartList, onListTitle, onSubmitList, onCancelList,
  onEditBoard, onDeleteBoard,
}: {
  name: string;
  description?: string;
  addingList: boolean;
  listTitle: string;
  onStartList: () => void;
  onListTitle: (v: string) => void;
  onSubmitList: () => void;
  onCancelList: () => void;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{name || "Untitled Board"}</h1>
        {description ? <p className="text-muted-foreground mt-1">{description}</p> : null}
      </div>

      <div className="flex items-center gap-2">
        {addingList ? (
          <>
            <Input
              placeholder="List title"
              value={listTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onListTitle(e.target.value)}
              className="w-48"
            />
            <Button onClick={onSubmitList}>Add</Button>
            <Button variant="outline" onClick={onCancelList}>Cancel</Button>
          </>
        ) : (
          <Button onClick={onStartList}>Add List</Button>
        )}

        <Button variant="outline" onClick={onEditBoard}>Edit Board</Button>
        <Button variant="destructive" onClick={onDeleteBoard}>Delete</Button>
      </div>
    </div>
  );
}
