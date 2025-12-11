import Card from '../atoms/Card'
import Icon from '../atoms/Icon'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card padding="lg" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <p className="text-3xl font-bold text-[#232946]">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C1A15B]">
          <Icon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}
