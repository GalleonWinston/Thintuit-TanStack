import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { SignJWT, jwtVerify } from 'jose'
import z from 'zod'

const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
})

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export const adminLogin = createServerFn({ method: 'POST' })
  .inputValidator(credentialsSchema)
  .handler(async ({ data }) => {
    if (
      data.username !== process.env.ADMIN_USERNAME ||
      data.password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error('Wrong credentials')
    }

    const token = await new SignJWT({ username: data.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(getJwtSecret())

    setCookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIE === 'true',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { success: true }
  })

export const verifyAdminSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    const token = getCookie('admin_token')
    if (!token) throw new Error('Unauthorized')
    await jwtVerify(token, getJwtSecret())
  })

export const adminLogout = createServerFn({ method: 'POST' })
  .handler(() => {
    deleteCookie('admin_token', { path: '/' })
  })
