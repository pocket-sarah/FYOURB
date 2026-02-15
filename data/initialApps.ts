import { BankApp } from '../types';

export const INITIAL_APPS: BankApp[] = [
  {
    id: 'wallet',
    name: 'Wallet',
    brandColor: '#000000',
    icon: 'https://play-lh.googleusercontent.com/DHBlQKvUNbopIS-VjQb3fUKQ_QH0Em-Q66AwG6LwD1Sach3lUvEWDb6hh8xNvKGmctU=w480-h960-rw',
    isDocked: true,
    isBank: false,
    isInstalled: true,
    order: 0,
    category: 'finance'
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
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Toronto-Dominion_Bank_logo.svg/500px-Toronto-Dominion_Bank_logo.svg.png',
    isDocked: true,
    isBank: true,
    isInstalled: true,
    order: 2,
    category: 'finance'
  },
  {
    id: 'debugger',
    name: 'Debugger',
    brandColor: '#6366f1',
    icon: 'https://cdn-icons-png.flaticon.com/512/2592/2592317.png',
    isDocked: true,
    isBank: false,
    isInstalled: true,
    order: 3,
    category: 'system'
  },
  {
    id: 'bmo',
    name: 'BMO',
    brandColor: '#0079C1',
    icon: 'https://play-lh.googleusercontent.com/H2GJMHnfDIxt9lxqMSvl4pbvsNkHAJ65UsCMZMNXtPnN5TE4ULgNDY8I2FnQZnbXxG4E',
    isDocked: false,
    isBank: true,
    isInstalled: true,
    order: 4,
    category: 'finance'
  },
  {
    id: 'cibc',
    name: 'CIBC',
    brandColor: '#9D2235',
    icon: 'https://play-lh.googleusercontent.com/I7oMrRXJBEV0kprZtTGSh1Kj8_D1U8Vptgv1lEOJRBFwGNYQ21meIhqKzjajVdSh3g=w480-h960-rw',
    isDocked: false,
    isBank: true,
    isInstalled: true,
    order: 5,
    category: 'finance'
  },
  {
    id: 'servus',
    name: 'Servus',
    brandColor: '#00A3A1',
    icon: 'https://play-lh.googleusercontent.com/I5LtZUpoZQk3FtuPCDWZ1Y7Jdu6rFxzuWa9j85CH2RqDIR961h_JRiD1G3P9KFJx3g=w240-h480-rw',
    isDocked: false,
    isBank: true,
    isInstalled: true,
    order: 6,
    category: 'finance'
  },
  {
    id: 'store',
    name: 'Marketplace',
    brandColor: '#6366f1',
    icon: 'https://static.vecteezy.com/system/resources/previews/022/484/501/large_2x/google-play-store-icon-logo-symbol-free-png.png',
    isDocked: true,
    isBank: false,
    isInstalled: true,
    order: 7,
    category: 'system'
  },
  {
    id: 'lumina',
    name: 'Lumina AI',
    brandColor: '#6366f1',
    icon: 'https://cdn-icons-png.flaticon.com/512/8644/8644367.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 8,
    category: 'utilities'
  },
  {
    id: 'android_messenger',
    name: 'Messages',
    brandColor: '#1976D2',
    icon: 'https://preview.redd.it/c7iq314igac71.jpg?width=640&crop=smart&auto=webp&s=330cdb785a725525c8fc7f09406c24163d4a4b68',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 9,
    category: 'communication'
  },
  {
    id: 'zdm',
    name: 'Signal Relay',
    brandColor: '#ef4444',
    icon: 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 10,
    category: 'utilities'
  },
  {
    id: 'browser',
    name: 'Browser',
    brandColor: '#ffffff',
    icon: 'https://cdn-icons-png.flaticon.com/512/888/888846.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 11,
    category: 'utilities'
  },
  {
    id: 'notes',
    name: 'Notes',
    brandColor: '#ffffff',
    icon: 'https://cdn-icons-png.flaticon.com/512/564/564445.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 12,
    category: 'utilities'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    brandColor: '#1a73e8',
    icon: 'https://img.icons8.com/color/1200/apple-contacts.jpg',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 13,
    category: 'utilities'
  },
  {
    id: 'settings',
    name: 'Settings',
    brandColor: '#1c1c1e',
    icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png',
    isDocked: false,
    isBank: false,
    isInstalled: true,
    order: 14,
    category: 'system'
  }
];