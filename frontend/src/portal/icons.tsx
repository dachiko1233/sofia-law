// Line-icon set for the client portal. One consistent 24px grid, round caps,
// 1.75 stroke, currentColor — so icons inherit text colour everywhere.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 22, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </Svg>
);

export const FolderIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </Svg>
);

export const FileIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 16.5h6" />
  </Svg>
);

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V16H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M7.5 13h2v2h-2zM11 13h2v2h-2z" fill="currentColor" stroke="none" />
  </Svg>
);

export const InvoiceIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h9l3 3v13.5l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V5a2 2 0 0 1 2-2Z" />
    <path d="M9 8.5h6M9 12h6M9 15.5h3" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </Svg>
);

export const SupportIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.3" />
    <path d="m8.9 8.9-2.4-2.4M15.1 8.9l2.4-2.4M8.9 15.1l-2.4 2.4M15.1 15.1l2.4 2.4" />
  </Svg>
);

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 4 1.2 5.5 2 6.5H4c.8-1 2-2.5 2-6.5Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Svg>
);

export const UploadCloudIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 18a4 4 0 0 1-.8-7.9 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 18 18" />
    <path d="M12 12v6M9.5 14.2 12 11.6l2.5 2.6" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 5.5L20 7" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v10M8 10.5l4 4 4-4" />
    <path d="M5 19h14" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M6.5 7 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    <path d="M10 11v5.5M14 11v5.5" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.3 12.2 2.4 2.4 4.9-5" />
  </Svg>
);

export const AlertCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5M12 15.8v.2" />
  </Svg>
);

export const XCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
  </Svg>
);

export const HeadsetIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
    <path d="M5 13h2.2a1 1 0 0 1 1 1v3.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V13ZM19 13h-2.2a1 1 0 0 0-1 1v3.2a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1V13Z" />
    <path d="M19 17.5c0 1.9-1.6 3-3.5 3H13" />
  </Svg>
);

export const LogOutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 8 6 12l4 4M6 12h10" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
