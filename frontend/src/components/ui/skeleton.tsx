function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={`bg-primary/10 animate-pulse rounded-md ${className || ""}`}
      {...props}
    />
  );
}

export { Skeleton };
