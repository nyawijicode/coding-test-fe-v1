import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email wajib diisi.' })
    .email({ message: 'Format email tidak valid.' }),
  password: z.string().min(8, { message: 'Kata sandi minimal 8 karakter.' }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const authUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: z.string().trim().min(1),
})
