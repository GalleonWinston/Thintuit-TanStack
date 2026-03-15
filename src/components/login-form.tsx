import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import z from "zod"
import { adminLogin } from "@/server/admin"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const loginFormDefaultValues: LoginFormValues = {
  username: "",
  password: "",
}

export const loginFormSchema = loginSchema

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: loginFormDefaultValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      try {
        await adminLogin({ data: value })
        navigate({ to: "/admin" })
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Wrong credentials"
        setAuthError(msg)
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to Admin Dashboard</CardTitle>
          <CardDescription>
            Enter credentials to access to admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) => {
                    const result = loginSchema.shape.username.safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError>{String(field.state.meta.errors[0])}</FieldError>
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = loginSchema.shape.password.safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError>{String(field.state.meta.errors[0])}</FieldError>
                    )}
                  </Field>
                )}
              </form.Field>

              {authError && <FieldError>{authError}</FieldError>}

              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
