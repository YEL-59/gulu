import Link from 'next/link'

export default function SidebarNavItem({ href, label, icon: Icon, active }) {
  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200'
  const styles = active
    ? 'bg-blue-600 text-white'
    : 'text-gray-900 hover:bg-gray-100'

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {Icon ? <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-600'}`} /> : null}
      <span>{label}</span>
    </Link>
  )
}