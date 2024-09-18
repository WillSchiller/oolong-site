import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      {/* Track with neutral grey background */}
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300">
        {/* Range with a darker grey */}
        <SliderPrimitive.Range className="absolute h-full bg-gray-500" />
      </SliderPrimitive.Track>

      {/* Thumb with grey border and white fill */}
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 border-gray-500 bg-white shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
