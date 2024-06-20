import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../../trpc";
import { createPost } from "../../repositories/posts/posts.repository";

export const helloProcedure = publicProcedure
  .input(z.object({ text: z.string() }))
  .query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  });

export const inputCreate = z.object({ name: z.string().min(1) });
export const createPostProcedure = protectedProcedure
  .input(inputCreate)
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sessionId = ctx.session.user.id;

    return createPost(ctx, input, sessionId);
  });

export const getLatestPostProcedure = protectedProcedure.query(({ ctx }) => {
  return ctx.db.post.findFirst({
    orderBy: { createdAt: "desc" },
    where: { createdBy: { id: ctx.session.user.id } },
  });
});

export const getSecretMessageProcedure = protectedProcedure.query(() => {
  return "you can now see this secret message!";
});