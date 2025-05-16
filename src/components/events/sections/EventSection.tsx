'use client';

import React, { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, Edit, X } from 'lucide-react';

interface EventSectionProps {
  title: string;
  children: ReactNode;
  preview: ReactNode;
  isEmpty?: boolean;
  isCompleted?: boolean;
  isEditing: boolean;
  onEditToggle: () => void;
}

const EventSection: React.FC<EventSectionProps> = ({
  title,
  children,
  preview,
  isEmpty = false,
  isCompleted = false,
  isEditing,
  onEditToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    if (!isEditing) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="mb-6 border border-[var(--cognac)] rounded-lg overflow-hidden">
      {/* Section Header */}
      <div 
        className={`flex justify-between items-center p-4 cursor-pointer
          ${isEditing ? 'bg-[rgba(83,94,75,0.1)]' : isCompleted ? 'bg-[rgba(83,94,75,0.05)]' : 'bg-white'}`}
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-2">
          {isCompleted && !isEditing && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--sage-green)] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          )}
          <h3 className="text-lg font-medium text-[var(--sage-green)]">{title}</h3>
          {isCompleted && !isEditing && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--sage-green)] text-white">
              Completed
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault(); // Prevent any form submission
              onEditToggle();
              if (!isEditing) {
                setIsExpanded(true);
              }
            }}
            className="p-1.5 rounded-full hover:bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)]"
            aria-label={isEditing ? "Close editor" : "Edit"}
          >
            {isEditing ? <X size={18} /> : <Edit size={18} />}
          </button>
          {!isEditing && (
            <button 
              type="button"
              className="p-1.5 rounded-full hover:bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)]"
              aria-label={isExpanded ? "Collapse" : "Expand"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // Prevent any form submission
                toggleExpand(e);
              }}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Section Content */}
      {(isExpanded || isEditing) && (
        <div className={`p-4 border-t border-[var(--cognac)] ${isEditing ? 'bg-white' : 'bg-[rgba(83,94,75,0.02)]'}`}>
          {isEditing ? (
            <>
              {children}
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditToggle();
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-[var(--sage-green)] text-[var(--sage-green)] text-sm rounded-md hover:bg-[rgba(83,94,75,0.1)]"
                >
                  <X size={14} className="mr-1.5" />
                  Close Editor
                </button>
                <p className="text-xs text-gray-500 mt-1">Changes will only be saved when you click the &quot;Save&quot; or &quot;Publish&quot; button at the bottom of the page.</p>
              </div>
            </>
          ) : (
            <div>
              {isEmpty ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No information added yet</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onEditToggle();
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-[var(--sage-green)] text-[var(--sage-green)] text-sm rounded-md hover:bg-[rgba(83,94,75,0.1)]"
                  >
                    <Edit size={14} className="mr-1.5" />
                    Add Information
                  </button>
                </div>
              ) : (
                preview
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventSection; 