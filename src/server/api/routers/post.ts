import { createTRPCRouter } from "@/server/api/trpc";
import { createPostProcedure, getLatestPostProcedure, getSecretMessageProcedure, helloProcedure } from "../services/posts/posts.service";

export const postRouter = createTRPCRouter({
  hello: helloProcedure,
  create: createPostProcedure,
  getLatest: getLatestPostProcedure,
  getSecretMessage: getSecretMessageProcedure,
});
