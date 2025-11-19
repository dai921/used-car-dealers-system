'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Car } from 'lucide-react'

const DUMMY_USERS = [
  { id: 'admin', password: 'password123', name: '佐藤 太郎', role: 'admin' },
  { id: 'takahashi', password: 'test123', name: '高橋 次郎', role: 'user' },
  { id: 'suzuki', password: 'test123', name: '鈴木 花子', role: 'user' },
]

export default function LoginPage() {
  const router = useRouter()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = DUMMY_USERS.find(u => u.id === id && u.password === password)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      setError('IDまたはパスワードが正しくありません')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">中古車販売管理システム</CardTitle>
            <CardDescription className="mt-2">
              顧客管理・販売管理システム
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ユーザーID</Label>
              <Input
                id="id"
                type="text"
                placeholder="ユーザーIDを入力"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              アカウントの新規追加は管理者までお問い合わせください
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
