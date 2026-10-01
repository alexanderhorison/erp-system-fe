/**
 * Size for the buttons of a side-by-side action pair (Cancel + Save/Submit).
 *
 * Contained and outlined buttons build their height from different padding and
 * border widths, so they drift apart if either theme override changes. Pinning
 * the height and minimum width here keeps the pair identical whatever the
 * variants or labels are. Spread it first so callers can still add colours:
 *
 *   <Button sx={{ ...actionButtonSx, color: colors.foreground }} />
 */
export const actionButtonSx = {
  minWidth: 120,
  height: 40,
  py: 0
}

export default actionButtonSx
