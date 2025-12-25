import React, { useState, useEffect, useRef } from 'react';
import type { AppProps } from './types';

export interface FileItem {
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  modified?: string;
  size?: string;
  content?: string;
  url?: string;
}

export interface FinderConfig {
  favorites?: Array<{ name: string; icon?: React.ReactNode }>;
  locations?: Array<{ name: string; icon?: React.ReactNode }>;
  fileSystem?: Record<string, FileItem[]>;
  homePath?: string;
}

interface ContextMenuState {
  x: number;
  y: number;
  item: FileItem | null;
  isBackground: boolean;
}

const defaultIcons = {
  folder: (
    <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  ),
  file: (
    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
    </svg>
  ),
};

const ZFinder: React.FC<AppProps & { config?: FinderConfig }> = ({ className, config }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'columns' | 'gallery'>('icons');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Default sidebar favorites
  const favorites = config?.favorites || [
    { name: 'AirDrop' },
    { name: 'Recents' },
    { name: 'Applications' },
    { name: 'Desktop' },
    { name: 'Documents' },
    { name: 'Downloads' },
  ];

  const locations = config?.locations || [
    { name: 'Macintosh HD' },
    { name: 'iCloud Drive' },
  ];

  // Default file system
  const defaultFileSystem: Record<string, FileItem[]> = {
    Home: [
      { name: 'Applications', type: 'folder' },
      { name: 'Desktop', type: 'folder' },
      { name: 'Documents', type: 'folder' },
      { name: 'Downloads', type: 'folder' },
      { name: 'Movies', type: 'folder' },
      { name: 'Music', type: 'folder' },
      { name: 'Pictures', type: 'folder' },
    ],
    Documents: [
      { name: 'Projects', type: 'folder' },
      { name: 'README.md', type: 'file', size: '2 KB', content: '# My Documents\n\nWelcome to your documents folder.' },
    ],
    Downloads: [
      { name: 'example.pdf', type: 'file', size: '245 KB' },
    ],
  };

  const fileSystem = config?.fileSystem || defaultFileSystem;

  const getFilesForPath = (): FileItem[] => {
    const path = currentPath[currentPath.length - 1];
    return fileSystem[path] || [];
  };

  const files = getFilesForPath();

  const handleItemClick = (item: FileItem) => {
    setSelectedItem(item.name);
    if (item.type === 'file' && item.content) {
      setPreviewFile(item);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      if (item.url) {
        window.open(item.url, '_blank');
      } else {
        setCurrentPath([...currentPath, item.name]);
        setSelectedItem(null);
        setPreviewFile(null);
      }
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const handleSidebarClick = (name: string) => {
    if (name === config?.homePath || name === 'Home') {
      setCurrentPath(['Home']);
    } else {
      setCurrentPath(['Home', name]);
    }
    setSelectedItem(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
    setSelectedItem(null);
  };

  const handleContextMenu = (e: React.MouseEvent, item?: FileItem) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = contentRef.current?.getBoundingClientRect();
    const x = rect ? Math.min(e.clientX - rect.left, rect.width - 200) : e.clientX;
    const y = rect ? Math.min(e.clientY - rect.top, rect.height - 300) : e.clientY;

    setContextMenu({ x, y, item: item || null, isBackground: !item });

    if (item) {
      setSelectedItem(item.name);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] ${className || ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-b from-[#3d3d3d] to-[#2d2d2d] border-b border-black/30">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
            disabled={currentPath.length <= 1}
            onClick={() => setCurrentPath(currentPath.slice(0, -1))}
          >
            <svg className="w-4 h-4 text-white/70 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 opacity-30">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-white/70">
          {currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-white/40">/</span>}
              <button className="hover:text-white px-1" onClick={() => handleBreadcrumbClick(index)}>
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* View modes */}
        <div className="flex items-center gap-1 bg-black/30 rounded-lg p-0.5">
          {(['icons', 'list'] as const).map((mode) => (
            <button
              key={mode}
              className={`p-1.5 rounded ${viewMode === mode ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setViewMode(mode)}
            >
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mode === 'icons' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#1a1a1a]/95 border-r border-white/5 overflow-y-auto">
          <div className="p-2 pt-1">
            <div className="text-[11px] font-medium text-white/50 uppercase tracking-wide px-2 py-1.5">
              Favorites
            </div>
            {favorites.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 text-sm text-white/80"
                onClick={() => handleSidebarClick(item.name)}
              >
                {item.icon || <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>}
                {item.name}
              </button>
            ))}
          </div>
          <div className="p-2 pt-1">
            <div className="text-[11px] font-medium text-white/50 uppercase tracking-wide px-2 py-1.5">
              Locations
            </div>
            {locations.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 text-sm text-white/80"
                onClick={() => handleSidebarClick(item.name)}
              >
                {item.icon || <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>}
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div
          ref={contentRef}
          className="flex-1 p-4 overflow-y-auto bg-[#232323] relative"
          onContextMenu={(e) => handleContextMenu(e)}
        >
          {viewMode === 'icons' && (
            <div className="grid grid-cols-6 gap-4">
              {files.map((file) => (
                <button
                  key={file.name}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    selectedItem === file.name ? 'bg-blue-500/30' : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleItemClick(file)}
                  onDoubleClick={() => handleItemDoubleClick(file)}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                >
                  {file.icon || (file.type === 'folder' ? defaultIcons.folder : defaultIcons.file)}
                  <span className="text-xs text-white/80 mt-1 text-center truncate w-full">
                    {file.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-0.5">
              <div className="flex items-center px-2 py-1 text-xs text-white/50 border-b border-white/10">
                <span className="flex-1">Name</span>
                <span className="w-24">Date Modified</span>
                <span className="w-20 text-right">Size</span>
              </div>
              {files.map((file) => (
                <button
                  key={file.name}
                  className={`w-full flex items-center px-2 py-1.5 rounded ${
                    selectedItem === file.name ? 'bg-blue-500/30' : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleItemClick(file)}
                  onDoubleClick={() => handleItemDoubleClick(file)}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                >
                  <span className="flex items-center gap-2 flex-1">
                    <svg className={`w-4 h-4 ${file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      {file.type === 'folder' ? (
                        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                      ) : (
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                      )}
                    </svg>
                    <span className="text-sm text-white/80">{file.name}</span>
                  </span>
                  <span className="w-24 text-xs text-white/50">{file.modified || 'Today'}</span>
                  <span className="w-20 text-xs text-white/50 text-right">{file.size || '--'}</span>
                </button>
              ))}
            </div>
          )}

          {/* Context Menu */}
          {contextMenu && (
            <div
              className="absolute bg-[#2a2a2a]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl py-1 min-w-[200px] z-50"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(e) => e.stopPropagation()}
            >
              {contextMenu.isBackground ? (
                <>
                  <button className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm">
                    New Folder
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm">
                    Get Info
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm font-medium"
                    onClick={() => {
                      if (contextMenu.item) handleItemDoubleClick(contextMenu.item);
                      setContextMenu(null);
                    }}
                  >
                    Open
                  </button>
                  {contextMenu.item?.content && (
                    <button
                      className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm"
                      onClick={() => {
                        setPreviewFile(contextMenu.item);
                        setContextMenu(null);
                      }}
                    >
                      Quick Look
                    </button>
                  )}
                  <div className="h-px bg-white/10 my-1 mx-2" />
                  <button className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm">
                    Get Info
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/90 hover:bg-blue-500 rounded-sm">
                    Copy
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-2" />
                  <button className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 rounded-sm">
                    Move to Trash
                  </button>
                </>
              )}
            </div>
          )}

          {files.length === 0 && (
            <div className="flex items-center justify-center h-full text-white/40">
              This folder is empty
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 bg-gradient-to-b from-[#2a2a2a] to-[#252525] border-t border-black/30 text-xs text-white/60">
        {files.length} item{files.length !== 1 ? 's' : ''}
      </div>

      {/* Quick Look Preview */}
      {previewFile && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-[#1e1e1e] rounded-xl border border-white/20 shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-white/10">
              <span className="text-white font-medium">{previewFile.name}</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
                {previewFile.content}
              </pre>
            </div>
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-t border-white/10">
              <span className="text-xs text-white/50">{previewFile.size || 'Document'}</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZFinder;
