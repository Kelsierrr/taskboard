// app/board/[boardId]/page.tsx
import { use } from "react";
import { BoardView } from "@/components/board/board-view";

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = use(params);

  return (
    <main className="min-h-screen p-4">
      <BoardView boardId={boardId} />
    </main>
  );
}
