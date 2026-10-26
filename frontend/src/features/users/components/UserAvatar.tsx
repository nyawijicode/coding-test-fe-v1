import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AppUser } from '@/features/users/types'
import { initials } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  user: AppUser
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
      <AvatarFallback className={fallbackClassName}>{initials(user.fullName)}</AvatarFallback>
    </Avatar>
  )
}
