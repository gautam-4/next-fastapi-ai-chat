import * as React from "react"

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal"
}

type ScrollBarProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal"
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = "", children, ...props }, ref) => {
    const [showScrollbar, setShowScrollbar] = React.useState(false)
    const [scrollbarHeight, setScrollbarHeight] = React.useState(100)
    const [scrollbarTop, setScrollbarTop] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const [startY, setStartY] = React.useState(0)
    const [startScrollTop, setStartScrollTop] = React.useState(0)
    const [autoScroll, setAutoScroll] = React.useState(true)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const scrollbarRef = React.useRef<HTMLDivElement>(null)
    const autoScrollRef = React.useRef(autoScroll)
    const prevContentHeightRef = React.useRef(0)

    React.useEffect(() => {
      autoScrollRef.current = autoScroll
    }, [autoScroll])

    React.useEffect(() => {
      const container = containerRef.current
      const content = contentRef.current

      if (!container || !content) return

      const updateScrollbar = () => {
        const containerHeight = container.clientHeight
        const contentHeight = content.scrollHeight
        const shouldShowScrollbar = contentHeight > containerHeight

        setShowScrollbar(shouldShowScrollbar)
        if (shouldShowScrollbar) {
          const scrollbarHeight = (containerHeight / contentHeight) * containerHeight
          setScrollbarHeight(Math.max(scrollbarHeight, 20))
          
          const scrollTop = container.scrollTop
          const maxScrollTop = contentHeight - containerHeight
          const scrollPercentage = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0
          setScrollbarTop(scrollPercentage * (containerHeight - scrollbarHeight))
        }

        // Handle auto-scroll when content height changes
        const currentContentHeight = content.scrollHeight
        if (currentContentHeight > prevContentHeightRef.current) {
          if (autoScrollRef.current) {
            container.scrollTop = currentContentHeight - container.clientHeight
          }
        }
        prevContentHeightRef.current = currentContentHeight
      }

      const resizeObserver = new ResizeObserver(updateScrollbar)
      resizeObserver.observe(container)
      resizeObserver.observe(content)
      updateScrollbar()

      // Initial scroll to bottom
      container.scrollTop = container.scrollHeight - container.clientHeight

      return () => resizeObserver.disconnect()
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const container = containerRef.current
      const content = contentRef.current
      if (!container || !content) return

      const containerHeight = container.clientHeight
      const contentHeight = content.scrollHeight
      const maxScrollTop = contentHeight - containerHeight
      
      if (maxScrollTop <= 0) return

      const scrollPercentage = container.scrollTop / maxScrollTop
      setScrollbarTop(scrollPercentage * (containerHeight - scrollbarHeight))

      // Update auto-scroll state
      const isAtBottom = container.scrollTop + containerHeight >= contentHeight - 1
      setAutoScroll(isAtBottom)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      setStartY(e.clientY)
      setStartScrollTop(scrollbarTop)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !contentRef.current) return

      const container = containerRef.current
      const content = contentRef.current
      const containerHeight = container.clientHeight
      const contentHeight = content.scrollHeight
      const maxScrollTop = contentHeight - containerHeight

      if (maxScrollTop === 0) return

      const deltaY = e.clientY - startY
      const maxScrollbarTop = containerHeight - scrollbarHeight
      const newScrollbarTop = Math.max(0, Math.min(maxScrollbarTop, startScrollTop + deltaY))

      setScrollbarTop(newScrollbarTop)
      container.scrollTop = (newScrollbarTop / maxScrollbarTop) * maxScrollTop
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        <div
          ref={containerRef}
          className="h-full w-full overflow-auto hide-scrollbar"
          onScroll={handleScroll}
        >
          <div
            ref={contentRef}
            className="min-h-fit w-full rounded-[inherit]"
          >
            {children}
          </div>
        </div>

        <ScrollBar
          orientation="vertical"
          className={`${showScrollbar ? 'opacity-100' : 'opacity-0'} transition-opacity`}
          style={{
            height: `${scrollbarHeight}px`,
            top: `${scrollbarTop}px`,
          }}
          onMouseDown={handleMouseDown}
          isDragging={isDragging}
        />
      </div>
    )
  }
)

ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps & { isDragging?: boolean }>(
  ({ className = "", orientation = "vertical", isDragging, style, ...props }, ref) => {
    const baseClassName = `
      absolute flex touch-none select-none transition-opacity
      ${orientation === "vertical"
        ? "right-0 top-0 h-full w-2.5 border-l border-l-transparent p-[1px]"
        : "bottom-0 left-0 h-2.5 w-full border-t border-t-transparent p-[1px]"
      }
      ${className}
    `

    return (
      <div
        ref={ref}
        className={baseClassName}
        {...props}
      >
        <div
          className={`
            relative flex-1 rounded-full bg-zinc-700
            transition-colors
            hover:bg-zinc-600 active:bg-zinc-500
            ${isDragging ? 'opacity-100' : 'opacity-30'}
          `}
          style={style}
        />
      </div>
    )
  }
)

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }