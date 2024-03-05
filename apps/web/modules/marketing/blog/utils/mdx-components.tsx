import Image from "next/image";
import Link from "next/link";

const CustomImage = (props: any) => (
  <Image {...props} alt={props.alt} loading="lazy" />
);

const CustomLink = (props: any) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  return isInternalLink ? (
    <Link href={href} {...props}>
      {props.children}
    </Link>
  ) : (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  );
};

export const mdxComponents = {
  a: CustomLink,
  img: CustomImage,
};
