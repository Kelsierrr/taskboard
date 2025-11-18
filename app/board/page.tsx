// app/board/page.tsx
import Link from "next/link";

export default function BoardsIndex() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><Link className="text-primary underline" href="/board/b1">Open Board b1</Link></li>
        <li><Link className="text-primary underline" href="/board/b2">Open Board b2</Link></li>
      </ul>
    </main>
  );
}
