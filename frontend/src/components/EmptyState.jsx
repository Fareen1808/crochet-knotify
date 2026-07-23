import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '🧺', title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="font-serif text-xl text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-sm mb-6">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
