
import { z } from "zod";

export const signInZod = z.object({
    usernameEmail: z
        .string()
        .min(3, "Username or email must be at least 3 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
});
export type SignInZod = z.infer<typeof signInZod>;

export const signUpZod = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")

});
export type SignUpZod = z.infer<typeof signUpZod>;

export const verificationCodeZod = z.object({
    email: z.email(),
    code: z.string().length(6).regex(/^\d{6}$/)
});
export const emailZod = z.object({
    email: z.email()
});

export const createProjectZod = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Post can't be empty")
    .max(5000, "Post must not exceed 5000 characters"),

  language: z
    .string()
    .trim()
    .min(1, "Language can't be empty")
    .max(5000, "Language must not exceed 5000 characters"),
});
export type CreateProjectZod = z.infer<typeof createProjectZod>;