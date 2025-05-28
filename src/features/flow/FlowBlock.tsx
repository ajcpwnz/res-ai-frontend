import cx from 'classnames'
import { Skeleton } from "@/components/ui/skeleton"

export const FlowBlock = ({ children, className, loading, wide }: {
  children: React.ReactNode,
  className?: string,
  loading?: boolean
  wide?: boolean
}) => {


  return <div className={cx(wide ? 'w-full' : 'w-[420px]', className)}>
    {
      loading
        ? <div className="flex flex-col space-y-4 my-8">
          <Skeleton className="h-12 w-100 bg-gray-200"/>
          <Skeleton className="h-12 w-100 bg-gray-200"/>
          <Skeleton className="h-12 w-100 bg-gray-200"/>
        </div>
        : children
    }
  </div>
}
