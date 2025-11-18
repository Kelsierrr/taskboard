"use client";

import { useEffect, useMemo, useState } from "react";
import { BoardHeader } from "./BoardHeader";
import { ListColumn } from "./ListColumn";
import { AddCardForm } from "./AddCardForm";
import type { List, Task, Priority } from "@/lib/board-types";
import { loadBoardData, saveBoardData, uid, updateBoardMeta, deleteBoard } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function BoardView({ boardId }: { boardId: string }) {
  // --- load/persist (same as before)
  const seed = useMemo(() => {
    const existing = loadBoardData(boardId);
    return existing ?? {
      name: "Untitled Board",
      description: "",
      lists: [
        { id: uid(), title: "To Do", tasks: [] as Task[] },
        { id: uid(), title: "In Progress", tasks: [] as Task[] },
        { id: uid(), title: "Done", tasks: [] as Task[] },
      ],
    };
  }, [boardId]);

  const [name, setName] = useState(seed.name);
  const [description, setDescription] = useState(seed.description || "");
  const [lists, setLists] = useState<List[]>(seed.lists);

  useEffect(() => {
    saveBoardData(boardId, { name, description, lists });
  }, [boardId, name, description, lists]);

  // --- drag state (same)
  const [dragged, setDragged] = useState<{ taskId: string; fromListId: string } | null>(null);
  const [overListId, setOverListId] = useState<string | null>(null);
  function handleDragStart(taskId: string, listId: string) { setDragged({ taskId, fromListId: listId }); }
  function handleDragOver(e: React.DragEvent, listId: string) { e.preventDefault(); if (overListId !== listId) setOverListId(listId); }
  function handleDragEnd() { setDragged(null); setOverListId(null); }
  function handleDrop(targetListId: string) {
    if (!dragged) return;
    const { taskId, fromListId } = dragged;
    if (fromListId === targetListId) { handleDragEnd(); return; }
    setLists(prev => {
      const next = structuredClone(prev) as List[];
      const from = next.find(l => l.id === fromListId);
      const to = next.find(l => l.id === targetListId);
      if (!from || !to) return prev;
      const idx = from.tasks.findIndex(t => t.id === taskId);
      if (idx === -1) return prev;
      const task = from.tasks[idx];
      from.tasks.splice(idx, 1);
      to.tasks.push(task);
      return next;
    });
    handleDragEnd();
  }

  // --- inline add card state/handlers (unchanged; now passed down)
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("low");
  function startAdd(listId: string) { setAddingFor(listId); setNewTitle(""); setNewDesc(""); setNewPriority("low"); }
  function cancelAdd() { setAddingFor(null); }
  function submitAdd() {
    const title = newTitle.trim();
    if (!title || !addingFor) return;
    const newTask: Task = { id: uid(), title, description: newDesc, priority: newPriority };
    setLists(prev => prev.map(l => (l.id === addingFor ? { ...l, tasks: [...l.tasks, newTask] } : l)));
    setAddingFor(null);
  }
  function updateTask(updated: Task) {
    setLists(prev => prev.map(l => ({ ...l, tasks: l.tasks.map(t => (t.id === updated.id ? updated : t)) })));
  }
  function deleteTask(taskId: string) {
    setLists(prev => prev.map(l => ({ ...l, tasks: l.tasks.filter(t => t.id !== taskId) })));
  }

  // --- add list + edit/delete board (as you have)
  const [addingList, setAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  function submitList() {
    const t = listTitle.trim();
    if (!t) return;
    setLists(prev => [...prev, { id: uid(), title: t, tasks: [] }]);
    setListTitle(""); setAddingList(false);
  }

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDesc, setEditDesc] = useState(description);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <BoardHeader
        name={name}
        description={description}
        addingList={addingList}
        listTitle={listTitle}
        onStartList={() => setAddingList(true)}
        onListTitle={setListTitle}
        onSubmitList={submitList}
        onCancelList={() => { setAddingList(false); setListTitle(""); }}
        onEditBoard={() => { setEditName(name); setEditDesc(description); setEditOpen(true); }}
        onDeleteBoard={() => setConfirmOpen(true)}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {lists.map((list) => (
          <ListColumn
  key={list.id}
  list={list}
  isOver={overListId === list.id}
  addingFor={addingFor}
  newTitle={newTitle}
  newDesc={newDesc}
  newPriority={newPriority}
  onStartAdd={(id) => {
    setAddingFor(id);
    setNewTitle("");
    setNewDesc("");
    setNewPriority("low");
  }}
  onCancelAdd={cancelAdd}
  onSubmitAdd={submitAdd}
  onChangeTitle={setNewTitle}
  onChangeDesc={setNewDesc}
  onChangePriority={setNewPriority}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onUpdateTask={updateTask}
  onDeleteTask={deleteTask}
/>
        ))}
      </div>

      {/* Edit board dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit board</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={editName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)} placeholder="Board name" />
            <Input value={editDesc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDesc(e.target.value)} placeholder="Optional description" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const trimmed = editName.trim() || "Untitled Board";
              setName(trimmed);
              setDescription(editDesc.trim());
              saveBoardData(boardId, { name: trimmed, description: editDesc.trim(), lists });
              updateBoardMeta(boardId, (m) => ({ ...m, name: trimmed, description: editDesc.trim() }));
              setEditOpen(false);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete this board?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This removes the entire board and its lists.</p>
          <DialogFooter className="justify-between">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { deleteBoard(boardId); setConfirmOpen(false); router.push("/dashboard"); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
