export default function Input({
  label,
  id,
  icon,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`
            w-full h-10 border rounded-xl text-sm text-slate-800 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b]
            placeholder:text-slate-400 transition-all
            ${icon ? 'pl-9 pr-3' : 'px-3'}
            ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  )
}