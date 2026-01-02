import {
  MessageCircle,
  User,
  Search,
  Heart,
  Settings,
  Bell,
  UserPlus,
  UserMinus,
  Check,
  X,
  Send,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Film,
  Users,
  Grid,
  Eye,
  Clock,
  Star,
  Play,
  Calendar,
  TrendingUp,
  Filter,
  MoreVertical,
  LogOut,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Pause, // Пауза
  RotateCcw, // Повтор (restart)
  SkipBack, // Предыдущая серия
  SkipForward, // Следующая серия
  VolumeX, // Звук выключен
  Volume2, // Звук включен
  PictureInPicture, // PiP
  Maximize, // Fullscreen вход
  Minimize, // Fullscreen выход
  Music, // Озвучка
  List, // Список серий
  Square, // Пустой квадрат
  CheckSquare, // Галочка в квадрате (опционально)
  Tv,
  MessageSquare, // Отзывы (квадратное облачко)
  Trophy, // Достижения (кубок)
  MessagesSquare,
  SquareStack,
  Info, // Информация (i в круге)
  FileText, // Файл с текстом
  Share2,
  Shield, // Щит (приватность)
  UserCheck, // Пользователь с галочкой (друзья)
  UserX, // Пользователь с крестиком (никто)
  Image,
  Smile,
  ArrowUp,
  ThumbsUp, // Лайк (большой палец вверх)
  CornerUpLeft, // Ответить (стрелка ответа)
  Tags, // Теги (жанры)
  Building, // Здание (студия)
  Plus, // Плюс (добавить)
  ArrowLeft, // Стрелка влево (назад)
  ZoomIn, // Увеличение (зум)
  EyeOff, // Глаз перечёркнутый (скрыть пароль)
  Edit2, // Редактировать (карандаш)
  CheckCheck, // Две галочки (прочитано)
  Server, // Сервер
  RefreshCw, // Обновить (круговая стрелка)
} from 'lucide-vue-next'

export default {
  install(app) {
    // Регистрируем все иконки глобально
    app.component('IconMessage', MessageCircle)
    app.component('IconUser', User)
    app.component('IconSearch', Search)
    app.component('IconHeart', Heart)
    app.component('IconSettings', Settings)
    app.component('IconBell', Bell)
    app.component('IconUserPlus', UserPlus)
    app.component('IconUserMinus', UserMinus)
    app.component('IconCheck', Check)
    app.component('IconX', X)
    app.component('IconSend', Send)
    app.component('IconEdit', Edit)
    app.component('IconTrash', Trash2)
    app.component('IconChevronLeft', ChevronLeft)
    app.component('IconChevronRight', ChevronRight)
    app.component('IconMenu', Menu)
    app.component('IconHome', Home)
    app.component('IconFilm', Film)
    app.component('IconUsers', Users)
    app.component('IconGrid', Grid)
    app.component('IconEye', Eye)
    app.component('IconEyeOff', EyeOff)
    app.component('IconClock', Clock)
    app.component('IconStar', Star)
    app.component('IconPlay', Play)
    app.component('IconCalendar', Calendar)
    app.component('IconTrendingUp', TrendingUp)
    app.component('IconFilter', Filter)
    app.component('IconMoreVertical', MoreVertical)
    app.component('IconLogOut', LogOut)
    app.component('IconLock', Lock)
    app.component('IconMail', Mail)
    app.component('IconAlertCircle', AlertCircle)
    app.component('IconCheckCircle', CheckCircle)
    app.component('IconPause', Pause)
    app.component('IconRotateCcw', RotateCcw)
    app.component('IconSkipBack', SkipBack)
    app.component('IconSkipForward', SkipForward)
    app.component('IconVolumeX', VolumeX)
    app.component('IconVolume2', Volume2)
    app.component('IconPictureInPicture', PictureInPicture)
    app.component('IconMaximize', Maximize)
    app.component('IconMinimize', Minimize)
    app.component('IconMusic', Music)
    app.component('IconList', List)
    app.component('IconSquare', Square)
    app.component('IconCheckSquare', CheckSquare)
    app.component('IconTv', Tv)
    app.component('IconMessageSquare', MessageSquare)
    app.component('IconMessagesSquare', MessagesSquare)
    app.component('IconTrophy', Trophy)
    app.component('IconSquareStack', SquareStack)
    app.component('IconInfo', Info)
    app.component('IconFileText', FileText)
    app.component('IconShare2', Share2)
    app.component('IconShield', Shield)
    app.component('IconUserCheck', UserCheck)
    app.component('IconUserX', UserX)
    app.component('IconImage', Image)
    app.component('IconSmile', Smile)
    app.component('IconArrowUp', ArrowUp)
    app.component('IconThumbsUp', ThumbsUp)
    app.component('IconCornerUpLeft', CornerUpLeft)
    app.component('IconTags', Tags)
    app.component('IconBuilding', Building)
    app.component('IconPlus', Plus)
    app.component('IconArrowLeft', ArrowLeft)
    app.component('IconZoomIn', ZoomIn)
    app.component('IconEdit2', Edit2)
    app.component('IconCheckCheck', CheckCheck)
    app.component('IconServer', Server)
    app.component('IconRefreshCw', RefreshCw)
  },
}
