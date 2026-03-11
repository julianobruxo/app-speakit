"use client"

/**
 * PathConnector — draws an SVG curved path between two journey nodes.
 * The path renders in two layers: a grey "pending" track and an animated
 * coloured fill that grows to represent completed progress.
 */

interface Point {
  x: number
  y: number
}

interface PathConnectorProps {
  from: Point
  to: Point
  completed: boolean
  /** Width and height of the SVG canvas */
  canvasWidth: number
  canvasHeight: number
}

function toSVGPoint(p: Point, w: number, h: number): Point {
  return { x: (p.x / 100) * w, y: (p.y / 100) * h }
}

/**
 * Generates a smooth cubic bezier path between two points.
 * The control points are offset horizontally to create an S-curve feel.
 */
function cubicPath(a: Point, b: Point): string {
  const midY = (a.y + b.y) / 2
  const cp1 = { x: a.x, y: midY }
  const cp2 = { x: b.x, y: midY }
  return `M ${a.x} ${a.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${b.x} ${b.y}`
}

export function PathConnector({
  from,
  to,
  completed,
  canvasWidth,
  canvasHeight,
}: PathConnectorProps) {
  const a = toSVGPoint(from, canvasWidth, canvasHeight)
  const b = toSVGPoint(to, canvasWidth, canvasHeight)
  const d = cubicPath(a, b)

  return (
    <g>
      {/* Background track */}
      <path
        d={d}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="8 6"
      />
      {/* Completed fill */}
      {completed && (
        <path
          d={d}
          fill="none"
          stroke="#22c55e"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
    </g>
  )
}
