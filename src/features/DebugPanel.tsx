import { useDebug } from './DebugProvider'

export const DebugPanel = () => {
  const { entries } = useDebug()

  return <div
    style={{
      background: '#222',
      color: '#0f0',
      padding: '1rem',
      overflowY: 'auto',
      fontSize: '12px',
      zIndex: 9999,
    }}
  >
    {entries.map(({ id, data }) => (
      <div key={id} style={{ marginBottom: '0.5rem' }}>
        <strong>{id}</strong>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    ))}
  </div>
}
