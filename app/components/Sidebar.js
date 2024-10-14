'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  CodeBracketIcon, 
  ReceiptPercentIcon, 
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Overview', icon: HomeIcon, href: '/' },
  { name: 'Research Assistant', icon: SparklesIcon, href: '/research-assistant' },
  { name: 'Research Reports', icon: DocumentTextIcon, href: '/research-reports' },
  { name: 'API Playground', icon: CodeBracketIcon, href: '/api-playground' },
  { name: 'Invoices', icon: ReceiptPercentIcon, href: '/invoices' },
  { name: 'Documentation', icon: BookOpenIcon, href: '/documentation' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`bg-white h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 22.279V18.707C10.438 18.707 10.438 18.707 10.438 18.707C7.928 18.707 6.875 17.07 6.875 15.434C6.875 14.613 7.279 13.791 7.928 13.142C7.525 12.321 7.525 11.089 8.332 10.268C8.332 10.268 9.139 10.268 10.438 11.089C11.246 10.858 12.053 10.858 12.861 11.089C14.16 10.268 14.967 10.268 14.967 10.268C15.775 11.089 15.775 12.321 15.371 13.142C16.02 13.791 16.424 14.613 16.424 15.434C16.424 17.07 15.371 18.707 12.861 18.707C12.861 18.707 12.861 18.707 12.861 18.707V22.279C17.642 21.128 21.299 16.991 21.299 12C21.299 6.477 16.822 2 11.299 2H12Z" fill="currentColor"/>
            </svg>
            <span className="text-xl font-semibold">Dandi AI</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={`flex items-center p-4 hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-100' : ''}`}>
                <item.icon className={`h-6 w-6 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
