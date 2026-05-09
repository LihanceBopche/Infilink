'use client'
import { useState, useEffect } from 'react'
import { useAuth }    from '@/hooks/useAuth'
import { useToast }   from '@/hooks/useToast'
import { Button }     from '@/components/ui/Button'
import { Toast }      from '@/components/ui/Toast'
import { Input }      from '@/components/ui/Input'
import { api }        from '@/lib/api'

// Helper to load Razorpay script dynamically
function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function SettingsPage() {
  const { user, logout, refresh } = useAuth()
  const { message, showToast } = useToast()
  const [saving, setSaving]    = useState(false)
  const [paying, setPaying]    = useState(false)
  const [name,  setName]       = useState('')
  const [email, setEmail]      = useState('')

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email) }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await api.updateProfile({ name })
    setSaving(false)
    if (error) showToast('Failed to save — ' + error)
    else showToast('Settings saved! ✅')
  }

  const handleUpgrade = async () => {
    setPaying(true)
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      showToast('Razorpay SDK failed to load')
      setPaying(false)
      return
    }

    const { data: orderData, error: orderError } = await api.createPaymentOrder() as any
    
    if (orderError || !orderData) {
      showToast('Failed to initialize payment')
      setPaying(false)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_ScZR52tVaIGmk8',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Infilink Starter',
      description: 'Upgrade to Starter Plan',
      order_id: orderData.orderId,
      handler: async function (response: any) {
        // Verify Payment
        showToast('Verifying payment...')
        const { data: verifyData, error: verifyError } = await api.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }) as any

        if (verifyError || !verifyData?.success) {
          showToast('Payment verification failed!')
        } else {
          showToast('Payment successful! 🎉')
          refresh() // refresh user plan context
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#7c3aed',
      },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.on('payment.failed', function (response: any) {
      showToast('Payment failed: ' + response.error.description)
    })
    paymentObject.open()
    setPaying(false)
  }

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[28px] font-black text-gray-900 mb-8 tracking-tight">Settings</h1>

      <div className="space-y-5">
        {/* Account */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-[16px] font-extrabold text-gray-900 mb-5">Account Preferences</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <Input
              label="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              value={email}
              readOnly
              placeholder="your@email.com"
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div>
              <p className="text-[14px] font-extrabold text-gray-900">Handle</p>
              <p className="text-[13px] text-gray-500">infilink.in/{user?.handle}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.plan === 'starter' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
                {user?.plan} PLAN
              </span>
            </div>
          </div>
          <div className="mt-5">
            <Button variant="purple" loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Upgrade Banner */}
        {user?.plan !== 'starter' && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-600 p-6 md:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-widest mb-2 text-violet-200">Upgrade to Starter</p>
              <h3 className="text-[22px] font-black mb-2 tracking-tight">Unlock advanced analytics &amp; custom themes</h3>
              <p className="text-[14px] text-purple-100 mb-5">Subscribers, redirect links, deep analytics — all at just ₹249/mo.</p>
              <Button variant="white" loading={paying} onClick={handleUpgrade}>Upgrade Now →</Button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-red-100">
          <h2 className="text-[16px] font-extrabold text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-extrabold text-gray-900">Sign Out</p>
              <p className="text-[13px] text-gray-500">Securely log out of your account.</p>
            </div>
            <Button variant="outline" onClick={logout} className="border-red-200 text-red-600 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <Toast message={message} />
    </div>
  )
}