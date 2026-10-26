import type { ColumnDef } from '@tanstack/react-table'

import { UserAvatar } from '@/features/users/components/UserAvatar'
import type { AppUser } from '@/features/users/types'

function orDash(value: string): string {
  return value.trim() === '' ? '—' : value
}

export function createUserColumns(): ColumnDef<AppUser>[] {
  return [
    {
      id: 'avatar',
      header: 'Avatar',
      enableSorting: false,
      cell: ({ row }) => <UserAvatar user={row.original} />,
    },
    {
      accessorKey: 'fullName',
      header: 'Nama',
      enableSorting: false,
      cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block max-w-[220px] truncate text-muted-foreground">
          {orDash(row.original.email)}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telepon',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">{orDash(row.original.phone)}</span>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Perusahaan',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate">{orDash(row.original.companyName)}</span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'Kota',
      enableSorting: false,
      cell: ({ row }) => <span>{orDash(row.original.city)}</span>,
    },
  ]
}

export function UserMobileCard({ user }: { user: AppUser }) {
  return (
    <div className="flex gap-3 p-4">
      <UserAvatar user={user} className="h-11 w-11" />

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate font-medium">{user.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">{orDash(user.email)}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="tabular-nums">{orDash(user.phone)}</span>
          {user.companyName ? <span className="truncate">{user.companyName}</span> : null}
          {user.city ? <span>{user.city}</span> : null}
        </div>
      </div>
    </div>
  )
}
