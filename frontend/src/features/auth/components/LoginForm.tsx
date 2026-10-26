import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { getErrorMessage, getErrorStatus, getFieldErrors, getRetryAfterSeconds } from '@/lib/errors'

type LoginFormProps = {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [retryAfter, setRetryAfter] = useState(0)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (retryAfter <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setRetryAfter((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [retryAfter])

  const isLocked = loginMutation.isPending || retryAfter > 0

  const onSubmit = async (values: LoginInput) => {
    setFormError(null)

    try {
      const user = await loginMutation.mutateAsync(values)
      toast.success(`Selamat datang, ${user.name}.`)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const status = getErrorStatus(error)

      if (status === 429) {
        const seconds = getRetryAfterSeconds(error)
        setRetryAfter(seconds)
        setFormError(`Terlalu banyak percobaan. Coba lagi dalam ${seconds} detik.`)
        return
      }

      const fieldErrors = getFieldErrors(error)
      let hasFieldError = false

      if (fieldErrors.email) {
        form.setError('email', { type: 'server', message: fieldErrors.email })
        hasFieldError = true
      }

      if (fieldErrors.password) {
        form.setError('password', { type: 'server', message: fieldErrors.password })
        hasFieldError = true
      }

      if (hasFieldError) {
        form.setFocus(fieldErrors.email ? 'email' : 'password')
        return
      }

      setFormError(getErrorMessage(error, 'Email atau kata sandi tidak sesuai'))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {formError ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            {formError}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="nama@perusahaan.com"
                  disabled={loginMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata sandi</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Minimal 8 karakter"
                    className="pr-10"
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLocked}>
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Memeriksa…
            </>
          ) : retryAfter > 0 ? (
            <>Tunggu {retryAfter} detik</>
          ) : (
            'Masuk'
          )}
        </Button>
      </form>
    </Form>
  )
}
