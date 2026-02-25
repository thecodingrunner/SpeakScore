// app/admin/blog/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts } from '@/lib/mongodb/blog';
import AdminDeleteButton from './DeleteButton';

export default async function AdminBlogPage() {
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  console.log('[admin/blog] clerk email:', JSON.stringify(email), '| ADMIN_EMAIL:', JSON.stringify(adminEmail));

  if (!email || email.trim() !== adminEmail) redirect('/');

  const posts = await getAllPosts(false);

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-base-content">Blog Admin</h1>
          <Link href="/admin/blog/new" className="btn btn-primary btn-sm">
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-base-content/40">
            <p>No posts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td className="font-medium">{post.title}</td>
                    <td className="text-base-content/50 text-sm">{post.slug}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          post.published ? 'badge-success' : 'badge-ghost'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-sm text-base-content/50">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blog/${post.slug}/edit`}
                          className="btn btn-ghost btn-xs"
                        >
                          Edit
                        </Link>
                        <AdminDeleteButton slug={post.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
