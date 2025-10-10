import React from 'react';

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number, height: number };
  zIndex: number;
  onClose?: () => void;
  onFocus?: () => void;
  isActive?: boolean;
  isClosing?: boolean;
}

export interface DockItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}
