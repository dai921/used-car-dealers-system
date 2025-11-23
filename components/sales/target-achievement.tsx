'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPercentage } from '@/lib/sales-data-utils'
import { Progress } from '@/components/ui/progress'
import { Target } from 'lucide-react'

interface TargetAchievementProps {
  target: number
  actual: number
  title?: string
}

export function TargetAchievement({
  target,
  actual,
  title = '目標達成状況',
}: TargetAchievementProps) {
  const achievementRate = target > 0 ? (actual / target) * 100 : 0
  const isAchieved = achievementRate >= 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">目標台数</p>
            <p className="text-2xl font-bold">{target}<span className="ml-1 text-base text-muted-foreground">台</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">販売台数</p>
            <p className="text-2xl font-bold text-primary">
              {actual}<span className="ml-1 text-base text-muted-foreground">台</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">達成率</p>
            <p
              className={`text-2xl font-bold ${
                isAchieved ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {formatPercentage(achievementRate)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">進捗状況</span>
            <span className="font-medium">{formatPercentage(achievementRate)}</span>
          </div>
          <Progress
            value={Math.min(achievementRate, 100)}
            className="h-3"
          />
        </div>

      </CardContent>
    </Card>
  )
}

