import { PostContent } from "@marketing/blog/components/PostContent";
import { allPosts } from "contentlayer/generated";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBaseUrl } from "utils";

interface Params {
  slug: string;
  locale: string;
  lang: string;
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  const post = allPosts.find((post) => post.slug === slug);

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      images: post?.image
        ? [new URL(post?.image ?? "", getBaseUrl()).toString()]
        : [],
    },
  };
}

export default async function BlogPostPage({
  params: { slug },
}: {
  params: Params;
}) {
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    redirect("/blog");
  }

  const { title, date, authorName, authorImage, tags, image, url, body } = post;

  return (
    <div className="container max-w-6xl pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <Link href="/blog">&larr; Back to blog</Link>
        </div>

        <h1 className="text-4xl font-bold">{title}</h1>

        <div className="mt-4 flex items-center  justify-start gap-6">
          {authorName && (
            <div className="flex items-center">
              {authorImage && (
                <div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={authorImage}
                    alt={authorName}
                    fill
                    sizes="96px"
                    className="object-cover object-center"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold opacity-50">{authorName}</p>
              </div>
            </div>
          )}

          <div className="ml-auto mr-0">
            <p className="text-sm opacity-30">
              {Intl.DateTimeFormat("en-US").format(new Date(date))}
            </p>
          </div>

          {tags && (
            <div className="flex flex-1 flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-primary text-xs font-semibold uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      )}

      <PostContent mdx={body} />
    </div>
  );
}
