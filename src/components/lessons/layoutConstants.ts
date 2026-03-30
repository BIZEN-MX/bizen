import type { CSSProperties } from "react"

/**
 * Global layout constants (MANDATORY for all content).
 * Use these everywhere so every slide has the same container width and padding.
 * See cursor-rules.md "GLOBAL LAYOUT RULES".
 */

/** Max width of the centered content container. Same on all slides. */
export const CONTENT_MAX_WIDTH = 900

/** Horizontal padding: equal left and right. Use in CSS or style objects. */
export const CONTENT_PADDING_X = "clamp(16px, 4vw, 48px)"

/** Vertical padding for content area: balanced top and bottom. */
export const CONTENT_PADDING_Y = "clamp(24px, 4vh, 48px)"

/** Spacing between content and buttons (consistent). */
export const CONTENT_GAP = "clamp(16px, 3vw, 32px)"

/** Centered container base style: same width and alignment on all screens. */
export const CENTERED_CONTAINER_STYLE: CSSProperties = {
  width: "100%",
  maxWidth: CONTENT_MAX_WIDTH,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: CONTENT_PADDING_X,
  paddingRight: CONTENT_PADDING_X,
  boxSizing: "border-box",
}
