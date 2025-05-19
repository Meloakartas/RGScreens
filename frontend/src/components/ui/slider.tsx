import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-azure-600">
      <SliderPrimitive.Range className="absolute h-full bg-azure-700" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-secondary/50 bg-azure-500 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

// MultiSlider: two-thumb slider for range selection
const MultiSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    minStepBetween?: number;
  }
>(({ className, value = [0, 100], onValueChange, min = 0, max = 100, step = 1, minStepBetween = 1, ...props }, ref) => {
  // Clamp thumbs so they can't cross and respect minStepBetween
  const handleValueChange = (newValue: number[]) => {
    let [left, right] = newValue;
    if (left > right - minStepBetween) left = right - minStepBetween;
    if (right < left + minStepBetween) right = left + minStepBetween;
    left = Math.max(min, left);
    right = Math.min(max, right);
    if (onValueChange) onValueChange([left, right]);
  };
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-azure-600">
        <SliderPrimitive.Range className="absolute h-full bg-azure-700" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-secondary/50 bg-azure-500 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-secondary/50 bg-azure-500 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
MultiSlider.displayName = "MultiSlider";

export { Slider, MultiSlider }
