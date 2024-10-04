import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendEmail } from "@/server/api/services/mails/email.service";

export const emailRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { to, subject, text } = input;
      const result = await sendEmail(to, subject, text);
      return { success: true, messageId: result.messageId };
    }),
});
