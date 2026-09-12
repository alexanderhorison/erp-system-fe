/**
 * DatePickerHighZIndexStyles
 * -------------------------------------------------------------------------------------
 * `react-datepicker`'s popper paints at `z-index: 1` by default, which is too low
 * to reliably beat sibling page content (a later grid cell painting over an open
 * calendar) or MUI's `Dialog` (`z-index: 1300`, when the picker is used inside a
 * modal — the calendar renders visually behind the dialog's own body content).
 *
 * Mount this once per page/dialog and pair it with `popperClassName='high-z-index-popper'`
 * on every `DatePicker` that needs to paint above its surroundings. Inside a
 * scrollable container (e.g. `AppModal`'s body) also add
 * `popperProps={{ strategy: 'fixed' }}`, or the popper gets clipped instead of
 * simply under-layered.
 */
export default function DatePickerHighZIndexStyles() {
  return (
    <style jsx global>{`
      .react-datepicker-popper {
        z-index: 1500 !important;
      }
      .high-z-index-popper {
        z-index: 1500 !important;
      }
    `}</style>
  )
}
