'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import useUserStore from '@/store/userStore'
import { Crown, CreditCard, User, Bell, Shield, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const { subscriptionTier, subscriptionEndDate, isPro } = useUserStore()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ]

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing-portal', {
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
                <ul className="menu menu-compact">
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
                          <button className="btn btn-ghost btn-sm ml-2">Remove</button>
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
                            Email cannot be changed here. Manage in Clerk dashboard.
                          </span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Username</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.username || ''}
                          className="input input-bordered"
                        />
                      </div>

                      <div className="divider"></div>

                      <div className="flex gap-2">
                        <button className="btn btn-primary">Save Changes</button>
                        <button className="btn btn-ghost">Cancel</button>
                      </div>
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
                            <h3 className="text-2xl font-bold capitalize">{subscriptionTier} Plan</h3>
                          </div>
                          {subscriptionTier !== 'free' && subscriptionEndDate && (
                            <p className="text-base-content/70">
                              Next billing date: {new Date(subscriptionEndDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {subscriptionTier === 'free' && (
                          <Link href="/pricing" className="btn btn-primary">
                            Upgrade Plan
                          </Link>
                        )}
                      </div>

                      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
                        <div className="stat">
                          <div className="stat-title">Projects</div>
                          <div className="stat-value text-primary">
                            {subscriptionTier === 'free' ? '3' : '∞'}
                          </div>
                          <div className="stat-desc">
                            {subscriptionTier === 'free' ? 'Maximum allowed' : 'Unlimited'}
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Team Members</div>
                          <div className="stat-value text-secondary">
                            {subscriptionTier === 'free' ? '1' : subscriptionTier === 'pro' ? '5' : '∞'}
                          </div>
                          <div className="stat-desc">
                            {subscriptionTier === 'enterprise' ? 'Unlimited' : 'Maximum allowed'}
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Analytics</div>
                          <div className="stat-value text-accent">
                            {subscriptionTier === 'free' ? 'Basic' : 'Advanced'}
                          </div>
                          <div className="stat-desc">Data insights level</div>
                        </div>
                      </div>
                    </div>

                    {subscriptionTier !== 'free' && (
                      <div className="space-y-4">
                        <div className="alert">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Your subscription will automatically renew. You can cancel anytime.</span>
                        </div>

                        <div className="flex gap-2">
                          {subscriptionTier === 'pro' && (
                            <Link href="/pricing" className="btn btn-primary">
                              Upgrade to Enterprise
                            </Link>
                          )}
                          <button className="btn btn-error btn-outline">Cancel Subscription</button>
                        </div>
                      </div>
                    )}

                    {subscriptionTier === 'free' && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">Upgrade Benefits</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="card bg-base-200">
                            <div className="card-body">
                              <h4 className="font-bold">Pro Plan - $29/mo</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Unlimited projects</li>
                                <li>Advanced analytics</li>
                                <li>Priority support</li>
                                <li>Up to 5 team members</li>
                              </ul>
                            </div>
                          </div>
                          <div className="card bg-base-200">
                            <div className="card-body">
                              <h4 className="font-bold">Enterprise - $99/mo</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Everything in Pro</li>
                                <li>Unlimited team members</li>
                                <li>24/7 phone support</li>
                                <li>Custom integrations</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <Link href="/pricing" className="btn btn-primary btn-wide">
                          View All Plans
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Billing & Invoices</h2>

                    {subscriptionTier !== 'free' ? (
                      <div className="space-y-6">
                        <div className="alert alert-info">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Manage your billing details, payment methods, and view invoices in the Stripe portal.</span>
                        </div>

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
                              Open Billing Portal
                            </>
                          )}
                        </button>

                        <div className="divider">Recent Invoices</div>

                        <div className="overflow-x-auto">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Dec 1, 2024</td>
                                <td>{subscriptionTier} Plan</td>
                                <td>${subscriptionTier === 'pro' ? '29.00' : '99.00'}</td>
                                <td><span className="badge badge-success">Paid</span></td>
                                <td><button className="btn btn-ghost btn-xs">Download</button></td>
                              </tr>
                              <tr>
                                <td>Nov 1, 2024</td>
                                <td>{subscriptionTier} Plan</td>
                                <td>${subscriptionTier === 'pro' ? '29.00' : '99.00'}</td>
                                <td><span className="badge badge-success">Paid</span></td>
                                <td><button className="btn btn-ghost btn-xs">Download</button></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                        <h3 className="text-xl font-bold mb-2">No Billing Information</h3>
                        <p className="text-base-content/70 mb-6">
                          You're currently on the free plan. Upgrade to access billing features.
                        </p>
                        <Link href="/pricing" className="btn btn-primary">
                          View Plans
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold mb-3">Email Notifications</h3>
                        <div className="space-y-3">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <div>
                                <span className="label-text font-semibold">Product Updates</span>
                                <p className="text-sm text-base-content/60">
                                  Get notified about new features and improvements
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <div>
                                <span className="label-text font-semibold">Security Alerts</span>
                                <p className="text-sm text-base-content/60">
                                  Important security and account notifications
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" className="checkbox checkbox-primary" />
                              <div>
                                <span className="label-text font-semibold">Marketing Emails</span>
                                <p className="text-sm text-base-content/60">
                                  Receive tips, case studies, and promotional content
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <div>
                                <span className="label-text font-semibold">Weekly Reports</span>
                                <p className="text-sm text-base-content/60">
                                  Get weekly summaries of your activity
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div>
                        <h3 className="font-bold mb-3">Push Notifications</h3>
                        <div className="space-y-3">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                              <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                              <div>
                                <span className="label-text font-semibold">Browser Notifications</span>
                                <p className="text-sm text-base-content/60">
                                  Receive notifications in your browser
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <button className="btn btn-primary">Save Preferences</button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      <div className="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Security settings are managed through Clerk. Click below to access advanced security options.</span>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body">
                          <h3 className="font-bold">Password</h3>
                          <p className="text-sm text-base-content/70">
                            Last changed: 30 days ago
                          </p>
                          <button className="btn btn-outline btn-sm mt-2 self-start">
                            Change Password
                          </button>
                        </div>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body">
                          <h3 className="font-bold">Two-Factor Authentication</h3>
                          <p className="text-sm text-base-content/70">
                            Add an extra layer of security to your account
                          </p>
                          <button className="btn btn-primary btn-sm mt-2 self-start">
                            Enable 2FA
                          </button>
                        </div>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body">
                          <h3 className="font-bold">Active Sessions</h3>
                          <p className="text-sm text-base-content/70">
                            Manage devices where you're currently logged in
                          </p>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">Current Session</p>
                                <p className="text-xs text-base-content/60">Chrome on Windows • Sheffield, UK</p>
                              </div>
                              <span className="badge badge-success">Active</span>
                            </div>
                          </div>
                          <button className="btn btn-ghost btn-sm mt-2 self-start text-error">
                            Sign Out All Other Devices
                          </button>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="card bg-error/10 border border-error/30">
                        <div className="card-body">
                          <h3 className="font-bold text-error">Danger Zone</h3>
                          <p className="text-sm">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button className="btn btn-error btn-outline btn-sm mt-2 self-start">
                            Delete Account
                          </button>
                        </div>
                      </div>
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