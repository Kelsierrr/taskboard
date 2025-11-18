"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCardForm } from "./AddCardForm";
import { TaskCard } from "./task-card";
import type { List, Task, Priority } from "@/lib/board-types";

export function ListColumn({
  list,
  isOver,
  addingFor,
  newTitle,
  newDesc,
  newPriority,
  onStartAdd,
  onCancelAdd,
  onSubmitAdd,
  onChangeTitle,
  onChangeDesc,
  onChangePriority,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onUpdateTask,
  onDeleteTask,
}: {
  list: List;
  isOver: boolean;
  addingFor: string | null;
  newTitle: string;
  newDesc: string;
  newPriority: Priority;
  onStartAdd: (listId: string) => void;
  onCancelAdd: () => void;
  onSubmitAdd: () => void;
  onChangeTitle: (v: string) => void;
  onChangeDesc: (v: string) => void;
  onChangePriority: (v: Priority) => void;
  onDragOver: (e: React.DragEvent, listId: string) => void;
  onDrop: (listId: string) => void;
  onDragStart: (taskId: string, listId: string) => void;
  onDragEnd: () => void;
  onUpdateTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, list.id)}
      onDrop={() => onDrop(list.id)}
      className="w-full"
    >
      <Card
        className={`p-4 transition ${
          isOver ? "ring-2 ring-primary/50" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{list.title}</h2>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
            {list.tasks.length}
          </span>
        </div>

        {/* Tasks */}
        <div className="space-y-3 mb-4 min-h-12">
          {list.tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => onDragStart(task.id, list.id)}
              onDragEnd={onDragEnd}
            >
              <TaskCard
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            </div>
          ))}
        </div>

        {/* Inline add form or button */}
        {addingFor === list.id ? (
          <AddCardForm
            title={newTitle}
            desc={newDesc}
            priority={newPriority}
            onTitleChange={onChangeTitle}
            onDescChange={onChangeDesc}
            onPriorityChange={onChangePriority}
            onCancel={onCancelAdd}
            onSubmit={onSubmitAdd}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full text-muted-foreground bg-transparent"
            onClick={() => onStartAdd(list.id)}
          >
            + Add card
          </Button>
        )}
      </Card>
    </div>
  );
}
