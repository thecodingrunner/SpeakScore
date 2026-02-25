'use client';

import { useRouter } from 'next/navigation';

export default function AdminDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete post "${slug}"?`)) return;
    await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="btn btn-error btn-xs">
      Delete
    </button>
  );
}
