import type { IdeOption } from '../../types'

interface IdeIconProps {
  size?: number
}

interface BrandIconDef {
  title: string
  hex: string
  path: string
}

const BRANDS: Record<IdeOption, BrandIconDef> = {
  vscode: {
    title: 'Visual Studio Code',
    hex: '007ACC',
    path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.86-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.423a1 1 0 0 0 .002 1.603l3.383 2.697L.326 14.58a1 1 0 0 0-.002 1.603l2.342 1.924a1 1 0 0 0 1.266.058l4.881-3.708 9.46 8.86a1.5 1.5 0 0 0 1.704.29l4.963-2.375a1.5 1.5 0 0 0 0-2.689z',
  },
  intellij: {
    title: 'IntelliJ IDEA',
    hex: '000000',
    path: 'M0 0v24h24V0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723zm11.055 0H17v6.5c0 .612-.055 1.111-.222 1.556-.167.444-.39.777-.723 1.11-.277.279-.666.557-1.11.668a3.933 3.933 0 0 1-1.445.278c-.778 0-1.444-.167-1.944-.445a4.81 4.81 0 0 1-1.279-1.056l1.39-1.555c.277.334.555.555.833.722.277.167.611.278.945.278.389 0 .721-.111 1-.389.221-.278.333-.667.333-1.278zM2.222 19.5h9V21h-9z',
  },
  'eclipse-che': {
    title: 'Eclipse Che',
    hex: '525C86',
    path: 'M12 0L1.604 6.021v7.452L12 7.494l3.941 2.254 6.455-3.727zm10.396 10.527L12 16.506l-7.334-4.217-3.062 1.76v3.93L12 24l10.396-6.021z',
  },
  cursor: {
    title: 'Cursor',
    hex: '000000',
    path: 'M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23',
  },
}

function BrandIcon({ brand, size = 16 }: { brand: BrandIconDef; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={brand.title}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <title>{brand.title}</title>
      <path fill={`#${brand.hex}`} d={brand.path} />
    </svg>
  )
}

export function IdeIcon({ ide, size = 16 }: { ide: IdeOption; size?: number }) {
  return <BrandIcon brand={BRANDS[ide]} size={size} />
}

export function VsCodeIcon({ size = 16 }: IdeIconProps) {
  return <BrandIcon brand={BRANDS.vscode} size={size} />
}

export function IntelliJIcon({ size = 16 }: IdeIconProps) {
  return <BrandIcon brand={BRANDS.intellij} size={size} />
}

export function EclipseCheIcon({ size = 16 }: IdeIconProps) {
  return <BrandIcon brand={BRANDS['eclipse-che']} size={size} />
}

export function CursorIcon({ size = 16 }: IdeIconProps) {
  return <BrandIcon brand={BRANDS.cursor} size={size} />
}
