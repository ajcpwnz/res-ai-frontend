import { cn } from '@/lib/utils.ts'
import { Button } from 'components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { useLogin} from 'features/auth/hooks.ts'
import { ChangeEvent, useState } from 'react'
import { Link } from 'react-router'

export const SigninPage = ({ className, ...props }: { className?: string } & Record<string, any>) => {
  const { loginUser } = useLogin()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const updateField = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setForm(old => ({
      ...old,
      [key]: value
    }))
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    await loginUser(form)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Log In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={form.email}
                        onChange={updateField('email')}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required value={form.password} onChange={updateField('password')}/>
                    </div>
                    <Button type="submit" className="w-full">
                      Log In
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?&nbsp;
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
