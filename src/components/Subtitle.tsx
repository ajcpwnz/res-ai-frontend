import cx from 'classnames'

export const Subtitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <h3 className={cx('leading-loose text-base font-medium', className)}>{children}</h3>
}
