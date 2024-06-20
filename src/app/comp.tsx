"use client"

import { api } from "@/trpc/react"

export const Component = () => {
    const { data, isError, isLoading } = api.post.hello.useQuery({ text: "from tRPC" }, { });

    

    return (
      <div>
        <h1>comp.tsx{isLoading}</h1>
      </div>
    );
}