import * as React from "react"
import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * Card
 * ---------------------------------------------------------------------------*/

type CardProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
          "py-6",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

/* -----------------------------------------------------------------------------
 * CardHeader
 * ---------------------------------------------------------------------------*/

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
        "has-[data-slot=card-action]:grid-cols-[1fr_auto]",
        "border-b pb-6",
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

/* -----------------------------------------------------------------------------
 * CardTitle
 * ---------------------------------------------------------------------------*/

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h3">
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

/* -----------------------------------------------------------------------------
 * CardDescription
 * ---------------------------------------------------------------------------*/

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

/* -----------------------------------------------------------------------------
 * CardAction
 * ---------------------------------------------------------------------------*/

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
})
CardAction.displayName = "CardAction"

/* -----------------------------------------------------------------------------
 * CardContent
 * ---------------------------------------------------------------------------*/

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

/* -----------------------------------------------------------------------------
 * CardFooter
 * ---------------------------------------------------------------------------*/

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-6 border-t", className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

/* -----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}