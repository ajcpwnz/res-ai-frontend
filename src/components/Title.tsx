import cx from 'classnames'

export const Title = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <h2 className={cx('leading-loose text-lg', className)}>{children}</h2>
}
