"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

type CarouselApi = any // We'll use embla-carousel types later if needed

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  opts?: any
  setApi?: (api: CarouselApi) => void
  plugins?: any[]
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ setApi, className, children, ...props }, ref) => {
    const [emblaRef, setEmblaRef] = React.useState<any>(null)

    React.useEffect(() => {
      if (!emblaRef) return

      // Simple implementation for now - can be enhanced with full embla later
      const mockApi = {
        scrollPrev: () => {
          const container = emblaRef
          if (container) {
            container.scrollLeft -= 200
          }
        },
        scrollNext: () => {
          const container = emblaRef
          if (container) {
            container.scrollLeft += 200
          }
        },
        canScrollPrev: () => emblaRef?.scrollLeft > 0,
        canScrollNext: () => {
          const container = emblaRef
          return container ? container.scrollLeft < container.scrollWidth - container.clientWidth : false
        }
      }

      setApi?.(mockApi)
    }, [emblaRef, setApi])

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div
          ref={setEmblaRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {children}
        </div>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      "absolute left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </Button>
))
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      "absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next</span>
  </Button>
))
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
