const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger:  'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function Badge({ label, variant = 'default', icon }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      {icon && (
        <span className="material-symbols-outlined text-[13px]">{icon}</span>
      )}
      {label}
    </span>
  )
}