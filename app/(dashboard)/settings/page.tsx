// app/[locale]/(dashboard)/settings/page.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/contexts/SubscriptionContext'
import {
  Crown, CreditCard, User, Bell, Globe, Mic,
  Check, AlertCircle, Volume2, Target, Clock,
  Sparkles
} from 'lucide-react'
import { Mascot } from '@/components/global/Mascot'
import { useTranslations } from 'next-intl'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface PronunciationFocus {
  rVsL: boolean
  thSounds: boolean
  wordStress: boolean
  silentVowels: boolean
}

interface NotificationSettings {
  progressUpdates: boolean
  achievementAlerts: boolean
  newFeatures: boolean
}

/* ═══════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const t = useTranslations('settings')
  // FIX #1: Use SubscriptionContext instead of useUserStore for accurate pro status
  const { isPro } = useSubscription()

  const [activeTab, setActiveTab] = useState('account')
  const [billingLoading, setBillingLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Subscription details fetched from API (not zustand)
  const [subEndDate, setSubEndDate] = useState<string | null>(null)

  // Account
  const [displayName, setDisplayName] = useState('')

  // Practice — FIX #3: voice settings now live here instead of Language tab
  const [dailyGoal, setDailyGoal] = useState(10)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState('18:00')
  const [pronunciationFocus, setPronunciationFocus] = useState<PronunciationFocus>({
    rVsL: true, thSounds: true, wordStress: false, silentVowels: false,
  })
  const [practiceVoiceGender, setPracticeVoiceGender] = useState<'female' | 'male'>('female')
  const [practiceVoiceAccent, setPracticeVoiceAccent] = useState<'american' | 'british'>('american')

  // Notifications
  const [notifications, setNotifications] = useState<NotificationSettings>({
    progressUpdates: true, achievementAlerts: true, newFeatures: false,
  })

  // Language
  const [interfaceLanguage, setInterfaceLanguage] = useState<'en' | 'ja'>('en')

  /* ─── Tabs ─── */
  const tabs = [
    { id: 'account', label: t('tabs.account'), icon: User },
    { id: 'subscription', label: t('tabs.plan'), icon: Crown },
    { id: 'practice', label: t('tabs.practice'), icon: Mic },
    { id: 'notifications', label: t('tabs.alerts'), icon: Bell },
    { id: 'language', label: t('tabs.language'), icon: Globe },
  ]

  /* ─── Load all settings on mount ─── */
  useEffect(() => {
    if (user) {
      setDisplayName(user.fullName || '')
      loadPracticeSettings()
      loadNotificationSettings()
      loadLanguageSettings()
      loadSubscriptionDetails()
    }
  }, [user])

  const loadSubscriptionDetails = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      if (data.success && data.user) {
        setSubEndDate(data.user.subscriptionEndDate || null)
      }
    } catch (e) { console.error('Error loading subscription details:', e) }
  }

  const loadPracticeSettings = async () => {
    try {
      const res = await fetch('/api/user/practice-settings')
      const data = await res.json()
      if (data.success) {
        setDailyGoal(data.settings.dailyGoalMinutes ?? 10)
        setReminderEnabled(data.settings.reminderEnabled ?? true)
        setReminderTime(data.settings.reminderTime ?? '18:00')
        if (data.settings.pronunciationFocus) setPronunciationFocus(data.settings.pronunciationFocus)
      }
    } catch (e) { console.error('Error loading practice settings:', e) }
  }

  const loadNotificationSettings = async () => {
    try {
      const res = await fetch('/api/user/notifications')
      const data = await res.json()
      if (data.success) setNotifications(data.settings)
    } catch (e) { console.error('Error loading notification settings:', e) }
  }

  // FIX #2: Now loads practiceVoiceGender from the response
  const loadLanguageSettings = async () => {
    try {
      const res = await fetch('/api/user/language')
      const data = await res.json()
      if (data.success && data.settings) {
        setInterfaceLanguage(data.settings.interfaceLanguage || 'en')
        setPracticeVoiceAccent(data.settings.practiceVoiceAccent || 'american')
        setPracticeVoiceGender(data.settings.practiceVoiceGender || 'female')
      }
    } catch (e) { console.error('Error loading language settings:', e) }
  }

  /* ─── Save helpers ─── */
  const showSaveStatus = (status: 'success' | 'error', message?: string) => {
    setSaveStatus(status)
    if (message) setErrorMessage(message)
    setTimeout(() => { setSaveStatus('idle'); setErrorMessage('') }, 3000)
  }

  const handleSaveProfile = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      })
      const data = await res.json()
      data.success ? showSaveStatus('success') : showSaveStatus('error', data.error)
    } catch { showSaveStatus('error', 'Failed to save profile') }
  }

  // FIX #3: Practice save now also saves voice preferences via language endpoint
  const handleSavePracticeSettings = async () => {
    setSaveStatus('saving')
    try {
      // Save practice settings
      const practiceRes = await fetch('/api/user/practice-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyGoalMinutes: dailyGoal, reminderEnabled, reminderTime, pronunciationFocus }),
      })

      // Save voice preferences via language endpoint
      const voiceRes = await fetch('/api/user/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ practiceVoiceAccent, practiceVoiceGender }),
      })

      const practiceData = await practiceRes.json()
      const voiceData = await voiceRes.json()

      if (practiceData.success && voiceData.success) {
        showSaveStatus('success')
      } else {
        showSaveStatus('error', practiceData.error || voiceData.error || 'Failed to save')
      }
    } catch { showSaveStatus('error', 'Failed to save practice settings') }
  }

  const handleSaveNotifications = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications),
      })
      const data = await res.json()
      data.success ? showSaveStatus('success') : showSaveStatus('error', data.error)
    } catch { showSaveStatus('error', 'Failed to save notification preferences') }
  }

  // Language save — also triggers router.refresh() so next-intl reloads the new locale
  const handleSaveLanguage = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/user/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interfaceLanguage }),
      })
      const data = await res.json()
      if (data.success) {
        showSaveStatus('success')
        router.refresh()
      } else {
        showSaveStatus('error', data.error)
      }
    } catch { showSaveStatus('error', 'Failed to save language preferences') }
  }

  const handleManageBilling = async () => {
    setBillingLoading(true)
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Failed to open billing portal') }
    finally { setBillingLoading(false) }
  }

  /* ─── Loading state ─── */
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Mascot size={72} expression="thinking" className="animate-float opacity-60" />
        <span className="loading loading-dots loading-lg text-primary" />
      </div>
    )
  }

  const pro = isPro()

  /* ─── Save button ─── */
  const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={saveStatus === 'saving'}
        className="btn btn-primary btn-sm lg:btn-md shadow-sm shadow-primary/15 gap-2"
      >
        {saveStatus === 'saving' ? (
          <><span className="loading loading-spinner loading-xs" /> {t('save.saving')}</>
        ) : (
          <><Check className="w-4 h-4" /> {t('save.saveChanges')}</>
        )}
      </button>
      {saveStatus === 'success' && (
        <span className="flex items-center gap-1.5 text-success text-sm font-semibold animate-in fade-in duration-200">
          <Check className="w-4 h-4" /> {t('save.saved')}
        </span>
      )}
      {saveStatus === 'error' && (
        <span className="flex items-center gap-1.5 text-error text-sm font-semibold animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4" /> {errorMessage || t('save.error')}
        </span>
      )}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 lg:px-8 lg:py-8 pb-28 lg:pb-10">

      {/* ═══ HEADER ═══ */}
      <div className="mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content">{t('title')}</h1>
        <p className="text-sm lg:text-base text-base-content/45 mt-0.5 lg:mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-0 lg:gap-6">

        {/* ═══════════════════════════════════════════
            SIDEBAR / TAB NAV
            Mobile: horizontal sticky bar below top navbar
            Desktop: vertical sticky sidebar
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-1 -mx-4 px-4 lg:mx-0 lg:px-0 sticky top-14 lg:top-[4.5rem] z-30 lg:self-start">
          <div className="bg-base-100/90 backdrop-blur-xl lg:bg-base-100 border-b border-base-content/5 lg:border lg:rounded-2xl py-2 lg:py-0 -mt-1 lg:mt-0">
            <div className="lg:p-3">
              <nav className="flex justify-between lg:flex-col gap-1 overflow-x-auto scrollbar-hide lg:overflow-visible px-1 lg:px-0">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 lg:gap-2.5 px-3 lg:px-3.5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold
                        transition-all duration-200 whitespace-nowrap flex-shrink-0
                        ${active
                          ? 'bg-primary/10 text-primary'
                          : 'text-base-content/50 hover:text-base-content hover:bg-base-content/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className='hidden lg:block'>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-3 mt-3 lg:mt-0">
          <div className="card bg-base-100 border border-base-content/5 card-glow">
            <div className="card-body p-4 lg:p-7">

              {/* ────────────────────────────────
                  ACCOUNT
                  ──────────────────────────────── */}
              {activeTab === 'account' && (
                <div>
                  <SectionHeader title={t('account.title')} />

                  <div className="space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 lg:gap-5">
                      <div className="avatar">
                        <div className="w-14 lg:w-20 rounded-full ring-2 ring-primary/20 ring-offset-base-100 ring-offset-2">
                          <img src={user?.imageUrl || '/default-avatar.png'} alt="Profile" />
                        </div>
                      </div>
                      <p className="text-xs text-base-content/40">{t('account.photoHint')}</p>
                    </div>

                    {/* Name */}
                    <FieldGroup label={t('account.fullName')}>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="input input-bordered input-sm lg:input-md w-full"
                        placeholder={t('account.fullNamePlaceholder')}
                      />
                    </FieldGroup>

                    {/* Email */}
                    <FieldGroup label={t('account.email')} hint={t('account.emailHint')}>
                      <input
                        type="email"
                        value={user?.primaryEmailAddress?.emailAddress || ''}
                        className="input input-bordered input-sm lg:input-md w-full bg-base-200/50"
                        disabled
                      />
                    </FieldGroup>

                    <div className="divider my-1" />
                    <SaveButton onClick={handleSaveProfile} />
                  </div>
                </div>
              )}

              {/* ────────────────────────────────
                  SUBSCRIPTION
                  ──────────────────────────────── */}
              {activeTab === 'subscription' && (
                <div>
                  <SectionHeader title={t('plan.title')} />

                  {/* Plan card */}
                  <div className={`rounded-2xl p-4 lg:p-6 mb-5 border-2 ${
                    pro
                      ? 'bg-gradient-to-br from-primary/8 to-secondary/8 border-primary/15'
                      : 'bg-base-200/40 border-base-content/8'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          pro ? 'bg-primary/15' : 'bg-base-content/8'
                        }`}>
                          <Crown className={`w-5 h-5 ${pro ? 'text-primary' : 'text-base-content/40'}`} />
                        </div>
                        <div>
                          <h3 className="text-base lg:text-lg font-extrabold text-base-content">
                            {pro ? t('plan.proPlan') : t('plan.freePlan')}
                          </h3>
                          {pro && subEndDate && (
                            <p className="text-[11px] lg:text-xs text-base-content/45">
                              {t('plan.renews', { date: new Date(subEndDate).toLocaleDateString() })}
                            </p>
                          )}
                        </div>
                      </div>
                      {pro && (
                        <span className="badge badge-primary font-bold gap-1">
                          <Sparkles className="w-3 h-3" /> {t('plan.active')}
                        </span>
                      )}
                    </div>

                    {/* Feature comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
                      {[
                        { label: t('plan.sessions'), free: '5/mo', proVal: '∞' },
                        { label: t('plan.scenarios'), free: '5', proVal: 'All 11' },
                        { label: t('plan.analytics'), free: 'Basic', proVal: 'Full' },
                      ].map((f, i) => (
                        <div key={i} className="bg-base-100/80 rounded-xl p-2.5 lg:p-3 text-center">
                          <p className="text-[9px] lg:text-xs font-semibold text-base-content/40 uppercase tracking-wide mb-0.5 lg:mb-1">{f.label}</p>
                          <p className={`text-sm lg:text-lg font-extrabold ${pro ? 'text-primary' : 'text-base-content/60'}`}>
                            {pro ? f.proVal : f.free}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {pro ? (
                    <button
                      onClick={handleManageBilling}
                      disabled={billingLoading}
                      className="btn btn-ghost border border-base-content/10 btn-sm lg:btn-md gap-2"
                    >
                      {billingLoading ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {t('plan.manageBilling')}
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href="/pricing" className="btn btn-primary btn-sm lg:btn-md gap-2 shadow-sm shadow-primary/15">
                        <Crown className="w-4 h-4" /> {t('plan.upgradeToPro')}
                      </Link>
                      <span className="text-xs lg:text-sm text-base-content/40">{t('plan.unlockAll')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ────────────────────────────────
                  PRACTICE
                  ──────────────────────────────── */}
              {activeTab === 'practice' && (
                <div>
                  <SectionHeader title={t('practice.title')} />

                  <div className="space-y-5 lg:space-y-6">

                    {/* ─ Voice Settings (moved from Language tab) ─ */}
                    <div>
                      <h3 className="font-bold text-sm text-base-content/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" /> {t('practice.voice')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldGroup label={t('practice.voiceGender')} compact>
                          <select
                            className="select select-bordered select-sm lg:select-md w-full"
                            value={practiceVoiceGender}
                            onChange={(e) => setPracticeVoiceGender(e.target.value as 'female' | 'male')}
                          >
                            <option value="female">{t('practice.female')}</option>
                            <option value="male">{t('practice.male')}</option>
                          </select>
                        </FieldGroup>

                        <FieldGroup label={t('practice.voiceAccent')} compact>
                          <select
                            className="select select-bordered select-sm lg:select-md w-full"
                            value={practiceVoiceAccent}
                            onChange={(e) => setPracticeVoiceAccent(e.target.value as 'american' | 'british')}
                          >
                            <option value="american">{t('practice.american')}</option>
                            <option value="british">{t('practice.british')}</option>
                          </select>
                        </FieldGroup>
                      </div>
                    </div>

                    <div className="divider my-1" />

                    {/* ─ Daily Goal ─ */}
                    <div>
                      <h3 className="font-bold text-sm text-base-content/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" /> {t('practice.dailyGoal')}
                      </h3>
                      <div className="bg-base-200/30 rounded-xl p-3 lg:p-4 border border-base-content/5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-base-content/70">{t('practice.practiceTimeGoal')}</span>
                          <span className="text-lg font-extrabold text-primary">{dailyGoal} min</span>
                        </div>
                        <input
                          type="range" min="5" max="60" value={dailyGoal} step="5"
                          onChange={(e) => setDailyGoal(Number(e.target.value))}
                          className="range range-primary range-sm"
                        />
                        <div className="flex justify-between text-[10px] text-base-content/30 font-semibold px-0.5 mt-1.5">
                          <span>5m</span><span>15m</span><span>30m</span><span>45m</span><span>60m</span>
                        </div>
                      </div>
                    </div>

                    <div className="divider my-1" />

                    {/* ─ Pronunciation Focus ─ */}
                    <div>
                      <h3 className="font-bold text-sm text-base-content/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Mic className="w-4 h-4" /> {t('practice.pronunciationFocus')}
                      </h3>
                      <div className="space-y-1">
                        {[
                          { key: 'rVsL' as keyof PronunciationFocus, label: t('practice.rVsL'), desc: t('practice.rVsLDesc') },
                          { key: 'thSounds' as keyof PronunciationFocus, label: t('practice.thSounds'), desc: t('practice.thSoundsDesc') },
                          { key: 'wordStress' as keyof PronunciationFocus, label: t('practice.wordStress'), desc: t('practice.wordStressDesc') },
                          { key: 'silentVowels' as keyof PronunciationFocus, label: t('practice.silentVowels'), desc: t('practice.silentVowelsDesc') },
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-3 p-2.5 lg:p-3 rounded-xl hover:bg-base-200/30 cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={pronunciationFocus[item.key]}
                              onChange={(e) => setPronunciationFocus({ ...pronunciationFocus, [item.key]: e.target.checked })}
                              className="checkbox checkbox-primary checkbox-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-base-content block">{item.label}</span>
                              <span className="text-xs text-base-content/35">{item.desc}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="divider my-1" />

                    {/* ─ Reminders ─ */}
                    <div>
                      <h3 className="font-bold text-sm text-base-content/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {t('practice.reminders')}
                      </h3>

                      <label className="flex items-center gap-3 p-2.5 lg:p-3 rounded-xl hover:bg-base-200/30 cursor-pointer transition-colors mb-3">
                        <input
                          type="checkbox"
                          checked={reminderEnabled}
                          onChange={(e) => setReminderEnabled(e.target.checked)}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-base-content block">{t('practice.dailyReminder')}</span>
                          <span className="text-xs text-base-content/35">{t('practice.reminderDesc')}</span>
                        </div>
                      </label>

                      {reminderEnabled && (
                        <div className="pl-7 lg:pl-10">
                          <FieldGroup label={t('practice.reminderTime')} compact>
                            <select
                              className="select select-bordered select-sm w-full max-w-xs"
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
                            >
                              <option value="07:00">7:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="18:00">6:00 PM</option>
                              <option value="21:00">9:00 PM</option>
                            </select>
                          </FieldGroup>
                        </div>
                      )}
                    </div>

                    <div className="divider my-1" />
                    <SaveButton onClick={handleSavePracticeSettings} />
                  </div>
                </div>
              )}

              {/* ────────────────────────────────
                  NOTIFICATIONS
                  ──────────────────────────────── */}
              {activeTab === 'notifications' && (
                <div>
                  <SectionHeader title={t('notifications.title')} />

                  <div className="space-y-1 mb-6">
                    {[
                      { key: 'progressUpdates' as keyof NotificationSettings, label: t('notifications.progressUpdates'), desc: t('notifications.progressUpdatesDesc') },
                      { key: 'achievementAlerts' as keyof NotificationSettings, label: t('notifications.achievementAlerts'), desc: t('notifications.achievementAlertsDesc') },
                      { key: 'newFeatures' as keyof NotificationSettings, label: t('notifications.newFeatures'), desc: t('notifications.newFeaturesDesc') },
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-3 p-2.5 lg:p-3 rounded-xl hover:bg-base-200/30 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-base-content block">{item.label}</span>
                          <span className="text-xs text-base-content/35">{item.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="divider my-1" />
                  <SaveButton onClick={handleSaveNotifications} />
                </div>
              )}

              {/* ────────────────────────────────
                  LANGUAGE (voice settings removed)
                  ──────────────────────────────── */}
              {activeTab === 'language' && (
                <div>
                  <SectionHeader title={t('language.title')} />

                  <div className="space-y-5">
                    <FieldGroup label={t('language.interfaceLanguage')}>
                      <select
                        className="select select-bordered select-sm lg:select-md w-full"
                        value={interfaceLanguage}
                        onChange={(e) => setInterfaceLanguage(e.target.value as 'en' | 'ja')}
                      >
                        <option value="en">English</option>
                        <option value="ja">日本語 (Japanese)</option>
                      </select>
                    </FieldGroup>

                    <div className="divider my-1" />
                    <SaveButton onClick={handleSaveLanguage} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════ */

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-lg lg:text-2xl font-extrabold text-base-content mb-4 lg:mb-6">{title}</h2>
}

function FieldGroup({ label, hint, compact, children }: {
  label: string
  hint?: string
  compact?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="form-control">
      <label className="label pb-1">
        <span className={`label-text font-semibold ${compact ? 'text-xs text-base-content/60' : 'text-sm lg:text-base'}`}>{label}</span>
      </label>
      {children}
      {hint && (
        <label className="label pt-1">
          <span className="label-text-alt text-xs text-base-content/35">{hint}</span>
        </label>
      )}
    </div>
  )
}