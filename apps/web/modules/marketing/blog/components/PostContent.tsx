"use client";

import { MDX } from "contentlayer/core";
import { useMDXComponent } from "next-contentlayer/hooks";
import { mdxComponents } from "../utils/mdx-components";

export function PostContent({ mdx }: { mdx: MDX }) {
  const MDXContent = useMDXComponent(mdx.code);

  return (
    <div className="prose dark:prose-invert mx-auto mt-6 max-w-2xl">
      <MDXContent components={mdxComponents} />
    </div>
  );
}
