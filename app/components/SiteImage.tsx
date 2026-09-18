import { preload } from "react-dom";
import NextImage, { type ImageProps } from "next/image";
import rawManifest from "../image-manifest.json";

type Entry = { src: string; width: number; height: number; srcSet: string };
const manifest: Record<string, Entry> = rawManifest;

export default function SiteImage(props: ImageProps) {
  const entry = typeof props.src === "string" ? manifest[props.src] : undefined;
  if (!entry || props.fill || props.loader || props.placeholder === "blur" || props.overrideSrc || props.onLoadingComplete) {
    return <NextImage {...props} />;
  }
  const { src, width, height, priority, preload: shouldPreload, unoptimized, quality, placeholder,
    blurDataURL, loader, fill, overrideSrc, onLoadingComplete, ...rest } = props;
  const sizes = props.sizes ?? (width ? `${width}px` : "100vw");
  if (priority || shouldPreload) preload(entry.src, {
    as: "image", imageSrcSet: entry.srcSet, imageSizes: sizes, fetchPriority: "high",
  });
  return <img {...rest} src={entry.src} srcSet={entry.srcSet} sizes={sizes}
    width={width ?? entry.width} height={height ?? entry.height}
    loading={priority || shouldPreload ? "eager" : props.loading ?? "lazy"}
    decoding={props.decoding ?? "async"} fetchPriority={priority ? "high" : props.fetchPriority} />;
}
