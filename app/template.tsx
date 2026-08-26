/**
 * Runs on every navigation.
 *
 * A template re-mounts per route where a layout persists, so this is what makes
 * the entrance replay on each screen change. The shell — sidebar, alert bar,
 * profile — lives in layout.tsx and deliberately stays put while the page
 * beneath it transitions.
 *
 * The entrance fades opacity and deliberately does NOT translate. A transformed
 * element becomes the containing block for `position: fixed` descendants, which
 * would tear the contextual drawer off the viewport and pin it to this wrapper
 * for as long as the animation is mid-flight.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-page-in">{children}</div>;
}
