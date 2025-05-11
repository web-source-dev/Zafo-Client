'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

interface TabsProps {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs = ({ defaultValue, onValueChange, children, className = '' }: TabsProps) => {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </TabsPrimitive.Root>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <TabsPrimitive.List
      className={`flex border-b border-[var(--cognac)] ${className}`}
    >
      {children}
    </TabsPrimitive.List>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={`
        px-1 py-4 text-sm font-medium border-b-2 -mb-px
        data-[state=active]:border-[var(--sage-green)] data-[state=active]:text-[var(--sage-green)]
        data-[state=inactive]:border-transparent data-[state=inactive]:text-black
        data-[state=inactive]:hover:text-[var(--sage-green)] data-[state=inactive]:hover:border-[var(--cognac)]
        whitespace-nowrap mr-8 outline-none focus:outline-none
        ${className}
      `}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  return (
    <TabsPrimitive.Content
      value={value}
      className={`mt-6 focus:outline-none ${className}`}
    >
      {children}
    </TabsPrimitive.Content>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 