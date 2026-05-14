import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getRequest, updateRequest, deleteRequest } from '../../api/requests.api'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'

const TRANSITIONS = {
  pending:   ['in_review', 'cancelled'],
  in_review: ['approved', 'rejected'],
  approved:  [],
  rejected:  [],
  cancelled: [],
}

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getRequest(id)
      .then(setRequest)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleStatusChange(newStatus) {
    try {
      const updated = await updateRequest(id, { status: newStatus })
      setRequest(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta solicitud?')) return
    try {
      await deleteRequest(id)
      navigate('/requests')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Cargando...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!request) return null

  const nextStatuses = TRANSITIONS[request.status] || []

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/requests" className="hover:text-blue-600">Solicitudes</Link>
        <span>/</span>
        <span className="text-gray-800">{request.title}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>

        {request.description && (
          <p className="text-sm text-gray-600 mb-6">{request.description}</p>
        )}

        <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <dt className="text-gray-400">Área</dt>
            <dd className="text-gray-800">{request.area_name}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Categoría</dt>
            <dd className="text-gray-800">{request.category_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Prioridad</dt>
            <dd className="text-gray-800">{request.priority || 'normal'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Solicitante</dt>
            <dd className="text-gray-800">{request.user_name}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Creada</dt>
            <dd className="text-gray-800">{new Date(request.created_at).toLocaleDateString('es-MX')}</dd>
          </div>
        </dl>

        {user?.role === 'admin' && nextStatuses.length > 0 && (
          <div className="flex gap-2 mb-4">
            {nextStatuses.map((s) => (
              <Button
                key={s}
                variant={s === 'rejected' || s === 'cancelled' ? 'danger' : 'primary'}
                onClick={() => handleStatusChange(s)}
              >
                {s === 'in_review' ? 'Iniciar revisión' : s === 'approved' ? 'Aprobar' : s === 'rejected' ? 'Rechazar' : 'Cancelar'}
              </Button>
            ))}
          </div>
        )}

        {user?.role === 'admin' && (
          <Button variant="secondary" onClick={handleDelete}>Eliminar</Button>
        )}
      </div>
    </div>
  )
}
