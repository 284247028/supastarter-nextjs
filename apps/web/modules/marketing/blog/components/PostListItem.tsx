"use client";

import { Post } from "contentlayer/generated";
import Image from "next/image";
import Link from "next/link";

export function PostListItem({ post }: { post: Post }) {
  const { title, excerpt, authorName, image, date, url, authorImage, tags } =
    post;

  return (
    <div className=" rounded-2xl border p-6 ">
      {image && (
        <div className="relative -m-4 mb-4 aspect-[16/9] overflow-hidden rounded-xl ">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center"
          />
          <Link href={url} className="absolute inset-0" />
        </div>
      )}

      {tags && (
        <div className="mb-2 flex flex-wrap gap-2">
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

      <Link href={url} className="text-xl font-semibold">
        {title}
      </Link>
      {excerpt && <p className="opacity-50">{excerpt}</p>}

      <div className="mt-4 flex items-center justify-between">
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
      </div>
    </div>
  );
}
