'use client'

import { useState } from 'react'
import { Plus, FolderKanban, Calendar, Users as UsersIcon, MoreVertical } from 'lucide-react'
import useUserStore from '@/store/userStore'
import Link from 'next/link'

export default function ProjectsPage() {
  const { subscriptionTier } = useUserStore()
  const [projects] = useState([
    { 
      id: 1, 
      name: 'E-commerce Platform', 
      description: 'Building a modern online store',
      status: 'active',
      members: 3,
      createdAt: '2024-01-15',
      progress: 65
    },
    { 
      id: 2, 
      name: 'Mobile App Redesign', 
      description: 'UI/UX improvements for iOS app',
      status: 'active',
      members: 2,
      createdAt: '2024-02-01',
      progress: 40
    },
    { 
      id: 3, 
      name: 'API Integration', 
      description: 'Third-party service integration',
      status: 'completed',
      members: 1,
      createdAt: '2023-12-10',
      progress: 100
    },
  ])

  const projectLimit = subscriptionTier === 'free' ? 3 : Infinity
  const canCreateMore = subscriptionTier !== 'free' || projects.length < projectLimit

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-base-content/60 mt-1">
            {subscriptionTier === 'free' 
              ? `${projects.length} of ${projectLimit} projects used`
              : `${projects.length} active projects`
            }
          </p>
        </div>
        {canCreateMore ? (
          <button className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        ) : (
          <Link href="/pricing" className="btn btn-primary gap-2">
            Upgrade to Create More
          </Link>
        )}
      </div>

      {/* Project Limit Warning */}
      {subscriptionTier === 'free' && projects.length >= projectLimit && (
        <div className="alert alert-warning mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div className="font-bold">Project limit reached</div>
            <div className="text-sm">Upgrade to Pro for unlimited projects</div>
          </div>
          <Link href="/pricing" className="btn btn-sm">
            Upgrade
          </Link>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                    <MoreVertical className="w-4 h-4" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Edit</a></li>
                    <li><a>Duplicate</a></li>
                    <li><a>Archive</a></li>
                    <li><a className="text-error">Delete</a></li>
                  </ul>
                </div>
              </div>

              <h3 className="card-title text-lg">{project.name}</h3>
              <p className="text-sm text-base-content/70">{project.description}</p>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-base-content/70">Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={project.progress} 
                  max="100"
                ></progress>
              </div>

              <div className="divider my-2"></div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-base-content/60">
                  <UsersIcon className="w-4 h-4" />
                  {project.members} members
                </div>
                <div className="flex items-center gap-1 text-base-content/60">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="card-actions justify-end mt-2">
                <span className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Project Card */}
        {canCreateMore && (
          <button className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-dashed border-base-300 hover:border-primary">
            <div className="card-body items-center justify-center text-center min-h-[300px]">
              <div className="p-4 bg-primary/10 rounded-full mb-3">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Create New Project</h3>
              <p className="text-base-content/60">Start building something amazing</p>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}