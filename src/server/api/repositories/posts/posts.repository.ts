import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type inputCreate } from "../../services/posts/posts.service";

type InputCreate = z.infer<typeof inputCreate>;
export const createPost = (ctx: { db: PrismaClient; }, input: InputCreate, userId: string) => {
  return ctx.db.post.create({
    data: {
      name: input.name,
      createdBy: { connect: { id: userId } },
    },
  });
};
