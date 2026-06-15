import { svg } from 'redom'

export default function makeIcon(
  className: string,
  width: number,
  height: number,
  href: string,
  extraAttrs: Record<string, string | number> = {}
) {
  return svg(
    `svg.${className}`,
    {
      width,
      height,
      'aria-hidden': 'true',
      ...extraAttrs,
    },
    svg('use', {
      xlink: { href },
    })
  )
}