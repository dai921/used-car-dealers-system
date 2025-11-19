'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to customers page by default
    router.push('/dashboard/customers')
  }, [router])

  return null
}
