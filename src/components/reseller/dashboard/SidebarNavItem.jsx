import Link from 'next/link'

export default function SidebarNavItem({ href, label, icon: Icon, active, variant = 'default' }) {
  const base = 'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors'
  const defaultStyles = active ? 'bg-blue-50 text-primary-600' : 'hover:bg-muted'
  const analyticsStyles = active
    ? 'bg-blue-600/10 text-blue-700 ring-1 ring-blue-200'
    : 'hover:bg-blue-50 hover:text-blue-700'
  const styles = variant === 'analytics' ? analyticsStyles : defaultStyles
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {Icon ? <Icon className='h-4 w-4' /> : null}
      <span>{label}</span>
      {variant === 'analytics' && active ? (
        <span className='ml-auto inline-block h-2 w-2 rounded-full bg-blue-500' />
      ) : null}
    </Link>
  )
}