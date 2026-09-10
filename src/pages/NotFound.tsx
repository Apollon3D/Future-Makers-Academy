import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="font-mono text-5xl text-muted">404</div>
      <p className="mt-3 text-text">That page isn’t part of the curriculum.</p>
      <Link to="/">
        <Button className="mt-5">Back to dashboard</Button>
      </Link>
    </div>
  )
}
