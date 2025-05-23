import cx from 'classnames'
import { Loader } from 'components/Loader.tsx'

export const FlowBlock = ({ children, className, loading, wide }: {
  children: React.ReactNode,
  className?: string,
  loading?: boolean
  wide?: boolean
}) => {


  return <div className={cx(wide ? 'w-full' : 'w-[420px]', className)}>{loading ? <Loader /> : children}</div>
}
