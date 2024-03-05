import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Bell,
  Book,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Clock,
  Cloud,
  Cookie,
  CreditCard,
  Dot,
  Eye,
  EyeOff,
  Globe,
  Grid,
  HardDrive,
  Home,
  Info,
  Key,
  Loader,
  LogOut,
  Mail,
  MailCheck,
  Menu,
  Moon,
  MoreVertical,
  MousePointer,
  Paperclip,
  Pause,
  Phone,
  Plus,
  Send,
  Settings,
  SquareUserRound,
  Star,
  Sun,
  Trash,
  Twitter,
  Undo,
  Upload,
  User,
  UserCog,
  UserRoundX,
  Users,
  Users2,
  Wand2,
  X,
} from "lucide-react";

interface IconProps {
  className?: string;
}

export const Icon = {
  // ui
  submit: Send,
  mail: Mail,
  warning: AlertTriangle,
  close: X,
  spinner: Loader,
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  show: Eye,
  hide: EyeOff,
  creditCard: CreditCard,
  archive: Archive,
  grid: Grid,
  settings: Settings,
  system: HardDrive,
  lightMode: Sun,
  darkMode: Moon,
  user: User,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  logout: LogOut,
  cookies: Cookie,
  menu: Menu,
  cloud: Cloud,
  pointer: MousePointer,
  paperclip: Paperclip,
  star: Star,
  upload: Upload,
  phone: Phone,
  key: Key,
  language: Globe,
  home: Home,
  check: Check,
  dot: Dot,
  plus: Plus,
  select: ChevronsUpDown,
  more: MoreVertical,
  delete: Trash,
  docs: Book,
  undo: Undo,
  notification: Bell,
  invitation: MailCheck,
  team: Users,
  pause: Pause,
  magic: Wand2,
  admin: UserCog,
  clock: Clock,
  impersonate: SquareUserRound,
  unimpersonate: UserRoundX,
  users: Users2,

  // social icons
  google: ({ ...props }: IconProps) => (
    <svg viewBox="0 0 488 512" {...props}>
      <path
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        fill="currentColor"
      />
    </svg>
  ),
  github: ({ ...props }: IconProps) => (
    <svg viewBox="0 0 496 512" {...props}>
      <path
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
        fill="currentColor"
      />
    </svg>
  ),
  twitter: Twitter,
  apple: ({ ...props }: IconProps) => (
    <svg viewBox="0 0 384 512" {...props}>
      <path
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
        fill="currentColor"
      />
    </svg>
  ),
};
