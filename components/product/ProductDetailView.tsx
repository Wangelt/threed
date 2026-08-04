"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Heart, Star } from "lucide-react";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductImage } from "@/components/product/ProductImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProductVariantSheet } from "@/components/modals/ProductVariantSheet";
import { fadeUp, scaleIn, slideLeft, slideRight, stagger, viewport } from "@/lib/motion";

interface ProductDetailViewProps {
  product: ProductModel;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="grid w-full gap-6 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-8">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-2 py-3 lg:px-0">
            <button type="button" onClick={() => router.back()} className="rounded-full bg-white/90 p-2 shadow-sm">
              <ArrowLeft size={22} className="text-black" />
            </button>
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="rounded-full bg-white/90 p-2 shadow-sm"
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart size={22} className={liked ? "fill-black text-black" : "text-black"} />
            </button>
          </div>
          <motion.button
            type="button"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            onClick={() => router.push(`/product/${product.id}/gallery`)}
            className="relative block h-80 w-full overflow-hidden rounded-none sm:rounded-xl lg:h-[520px]"
          >
            <ProductImage src={product.image} alt={product.name} className="h-full" />
          </motion.button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="py-2 lg:py-6"
        >
          <motion.h1 variants={fadeUp} className="text-[22px] font-bold sm:text-3xl">
            {product.name}
          </motion.h1>

          <motion.div variants={fadeUp} className="mt-2 flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-black text-black" : "text-border"}
              />
            ))}
            <span className="ml-1 text-[13px] text-text-secondary">
              {product.rating} ({product.reviews} reviews)
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-3 text-2xl font-extrabold sm:text-3xl">
            {product.price}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 border-t border-border pt-5">
            <p className="text-[11px] font-bold tracking-[1.6px] text-text-primary">
              HIGHLIGHTS
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {product.description}
            </p>
            <p className="mt-2 text-[13px] text-text-secondary">
              Materials: {product.materials.join(" · ")}
            </p>
          </motion.div>

          <motion.button
            type="button"
            variants={fadeUp}
            onClick={() => setExpanded(!expanded)}
            className="mt-5 flex w-full items-center justify-between"
          >
            <span className="text-base font-semibold">Product Details</span>
            <ChevronDown
              size={22}
              className={`transition-transform duration-250 ${expanded ? "rotate-180" : ""}`}
            />
          </motion.button>

          {expanded && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-3 text-sm leading-[1.6] text-text-secondary"
            >
              {product.description}
            </motion.p>
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="mt-5 flex gap-2.5 overflow-x-auto pb-1"
          >
            {product.gallery.map((src, i) => (
              <motion.button
                key={src}
                type="button"
                variants={i % 2 === 0 ? slideRight : slideLeft}
                onClick={() => router.push(`/product/${product.id}/gallery?index=${i}`)}
                className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[10px] sm:h-20 sm:w-20"
              >
                <ProductImage src={src} alt={`${product.name} ${i + 1}`} />
              </motion.button>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 hidden gap-3 lg:flex">
            <div className="flex-1">
              <PrimaryButton label="Add to Cart" onClick={() => setVariantOpen(true)} />
            </div>
            <button
              type="button"
              onClick={() => setVariantOpen(true)}
              className="flex h-[52px] flex-1 items-center justify-center rounded-xl border border-border text-[15px] font-medium text-black hover:bg-surface"
            >
              Buy now
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white px-4 py-3 sm:px-6 lg:hidden">
        <div className="flex gap-2.5">
          <div className="flex-1">
            <PrimaryButton label="Add to Cart" onClick={() => setVariantOpen(true)} />
          </div>
          <button
            type="button"
            onClick={() => setVariantOpen(true)}
            className="flex h-[52px] flex-1 items-center justify-center rounded-xl border border-border text-[15px] font-medium text-black hover:bg-surface"
          >
            Buy now
          </button>
        </div>
      </div>

      <ProductVariantSheet
        product={product}
        open={variantOpen}
        onClose={() => setVariantOpen(false)}
      />
    </div>
  );
}
