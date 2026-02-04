import { Types } from "mongoose";
import * as z from "zod";
const usernameSchemaZod = z.string().min(3).max(10);
const passwordSchemaZod = z
  .string()
  .min(8)
  .max(20)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/\d/)
  .regex(/[^A-Za-z0-9]/);

type username = z.infer<typeof usernameSchemaZod>;
type password = z.infer<typeof passwordSchemaZod>;

const userSchemaZod = z.object({
  username: usernameSchemaZod,
  password: passwordSchemaZod,
});

const contentSchemaZod = z.object({
  types: z.enum(["document", "Twitter", "youtube", "link"]),
  link: z.url({ message: "Invalid URL" }),
  title: z.string(),
  tags: z.string(),
});

type contentZod = z.infer<typeof contentSchemaZod>;

export type { username, password, contentZod };
export { userSchemaZod, contentSchemaZod };
