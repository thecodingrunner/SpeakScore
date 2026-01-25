'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import Link from 'next/link'
import useUserStore from '@/store/userStore'
import { Crown, CreditCard, User, Bell, Shield, Globe, Target, Mic } from 'lucide-react'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const { subscriptionTier, subscriptionEndDate } = useUserStore()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice Settings', icon: <Mic className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
  ]

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/billing-portal`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      alert('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-base-content/60 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <ul className="menu menu-compact gap-2">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <a
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'active' : ''}
                      >
                        {tab.icon}
                        {tab.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="avatar">
                          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user?.imageUrl || '/default-avatar.png'} alt="Profile" />
                          </div>
                        </div>
                        <div>
                          <button className="btn btn-primary btn-sm">Change Photo</button>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Full Name</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.fullName || ''}
                          className="input input-bordered"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Email Address</span>
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                          className="input input-bordered"
                          disabled
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Managed through Clerk authentication
                          </span>
                        </label>
                      </div>

                      <div className="divider"></div>

                      <button className="btn btn-primary">Save Changes</button>
                    </div>
                  </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Subscription</h2>

                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-bold capitalize">
                              {subscriptionTier === 'free' ? 'Free' : 'Premium'} Plan
                            </h3>
                          </div>
                          {subscriptionTier !== 'free' && subscriptionEndDate && (
                            <p className="text-base-content/70">
                              Next billing date: {new Date(subscriptionEndDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {subscriptionTier === 'free' && (
                          <Link href={`/pricing`} className="btn btn-primary">
                            Upgrade Plan
                          </Link>
                        )}
                      </div>

                      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
                        <div className="stat">
                          <div className="stat-title">Practice Sessions</div>
                          <div className="stat-value text-primary">
                            {subscriptionTier === 'free' ? '5/month' : '∞'}
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Scenarios</div>
                          <div className="stat-value text-secondary">
                            {subscriptionTier === 'free' ? '2' : 'All'}
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Analytics</div>
                          <div className="stat-value text-accent">
                            {subscriptionTier === 'free' ? 'Basic' : 'Detailed'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {subscriptionTier !== 'free' && (
                      <div className="space-y-4">
                        <button
                          onClick={handleManageBilling}
                          disabled={loading}
                          className="btn btn-primary gap-2"
                        >
                          {loading ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Manage Billing
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Practice Settings Tab */}
                {activeTab === 'practice' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Practice Settings</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold mb-3">Daily Goal</h3>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Practice time goal (minutes/day)</span>
                          </label>
                          <input 
                            type="range" 
                            min="5" 
                            max="60" 
                            defaultValue="10" 
                            className="range range-primary" 
                            step="5"
                          />
                          <div className="w-full flex justify-between text-xs px-2 mt-2">
                            <span>5 min</span>
                            <span>10 min</span>
                            <span>20 min</span>
                            <span>30 min</span>
                            <span>60 min</span>
                          </div>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div>
                        <h3 className="font-bold mb-3">Pronunciation Focus</h3>
                        <div className="space-y-2">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <span className="label-text">/r/ vs /l/ sounds</span>
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <span className="label-text">/th/ sounds (θ/ð)</span>
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" className="checkbox checkbox-primary" />
                              <span className="label-text">Word stress patterns</span>
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" className="checkbox checkbox-primary" />
                              <span className="label-text">Silent vowels</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div>
                        <h3 className="font-bold mb-3">Reminder Settings</h3>
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                            <div>
                              <span className="label-text font-semibold">Daily Practice Reminder</span>
                              <p className="text-sm text-base-content/60">
                                Get notified when it's time to practice
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="form-control mt-4">
                          <label className="label">
                            <span className="label-text">Reminder time</span>
                          </label>
                          <select className="select select-bordered">
                            <option>7:00 AM</option>
                            <option>12:00 PM</option>
                            <option selected>6:00 PM</option>
                            <option>9:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <button className="btn btn-primary">Save Preferences</button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                            <div>
                              <span className="label-text font-semibold">Progress Updates</span>
                              <p className="text-sm text-base-content/60">
                                Weekly summaries of your improvement
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                            <div>
                              <span className="label-text font-semibold">Achievement Alerts</span>
                              <p className="text-sm text-base-content/60">
                                Get notified when you unlock new badges
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-4">
                            <input type="checkbox" className="checkbox checkbox-primary" />
                            <div>
                              <span className="label-text font-semibold">New Features</span>
                              <p className="text-sm text-base-content/60">
                                Learn about new scenarios and improvements
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <button className="btn btn-primary">Save Preferences</button>
                    </div>
                  </div>
                )}

                {/* Language Tab */}
                {activeTab === 'language' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Language & Region</h2>

                    <div className="space-y-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Interface Language</span>
                        </label>
                        <select className="select select-bordered">
                          <option>English</option>
                          <option>日本語 (Japanese)</option>
                        </select>
                        <label className="label">
                          <span className="label-text-alt">
                            Japanese UI coming in Month 2
                          </span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Practice Voice Accent</span>
                        </label>
                        <select className="select select-bordered">
                          <option>American English</option>
                          <option>British English</option>
                        </select>
                      </div>

                      <div className="divider"></div>

                      <button className="btn btn-primary">Save Changes</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}