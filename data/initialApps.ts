
import { BankApp } from '../types';

export const INITIAL_APPS: BankApp[] = [
  {
    id: 'research',
    name: 'Research Hub',
    brandColor: '#00ff41',
    icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
    isDocked: true,
    isBank: false,
    isInstalled: true,
    order: 0,
    category: 'research'
  },
  {
    id: 'scotia',
    name: 'Scotiabank',
    brandColor: '#ED0711',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/aa/1a/8a/aa1a8a04-ba3d-6940-d0fe-f842f10fabc5/Placeholder.mill/400x400bb-75.webp',
    isDocked: true,
    isBank: true,
    isInstalled: true,
    order: 1,
    category: 'finance'
  },
  {
    id: 'td',
    name: 'TD Canada',
    brandColor: '#008A00',
    icon: 'https://tse3.mm.bing.net/th/id/OIP.CseFSiNj7XEforv285cZcQHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3',
    isDocked: true,
    isBank: true,
    isInstalled: true,
    order: 2,
    category: 'finance'
  },
  {
    id: 'harvester',
    name: 'Harvester',
    brandColor: '#ff003c',
    icon: 'https://cdn-icons-png.flaticon.com/512/7054/7054366.png',
    isDocked: true,
    isBank: false,
    isInstalled: true,
    order: 3,
    category: 'utilities'
  },
  {
    id: 'lumina',
    name: 'Lumina',
    brandColor: '#4f46e5',
    icon: 'https://cdn-icons-png.flaticon.com/512/3953/3953226.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 4,
    category: 'utilities'
  },
  {
    id: 'dominion',
    name: 'Dominion Core',
    brandColor: '#ff003c',
    icon: 'https://cdn-icons-png.flaticon.com/512/7054/7054366.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 5,
    category: 'admin'
  },
  {
    id: 'settings',
    name: 'Settings',
    brandColor: '#1c1c1e',
    icon: 'https://cdn-icons-png.flaticon.com/512/3953/3953226.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 6,
    category: 'system'
  }
];
