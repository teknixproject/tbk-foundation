'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import _ from 'lodash';
import { usePathname } from 'next/navigation'; // Thay useLocation bằng usePathname

interface DropdownProps {
  id: string;
  style?: any;
  data?: any;
  childs?: any[];
  menuClassDropdow?: any;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  style = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data = {},
  childs = [],
  menuClassDropdow,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy pathname từ Next.js
  const pathname = usePathname(); // Ví dụ: "/faq"
  const currentPath = pathname.split('/').pop() || ''; // Lấy phần cuối của pathname (ví dụ: "faq")

  const buttonSelectedClass = style?.dropdownStyles?.buttonSelected
    ? style.dropdownStyles.buttonSelected.toString()
    : '';
  const menuClass = style?.dropdownStyles?.menu ? style.dropdownStyles.menu.toString() : '';
  const buttonChildClass = style?.dropdownStyles?.button
    ? style.dropdownStyles.button.toString()
    : '';

  // Khởi tạo selectedItem dựa trên pathname hoặc child đầu tiên
  useEffect(() => {
    if (childs.length > 0) {
      // Tìm child có uid khớp với currentPath
      const matchedChild = childs.find((child) => child.uid === currentPath);
      if (matchedChild) {
        setSelectedItem(matchedChild.name || _.get(matchedChild, 'dataSlice.title'));
      } else {
        // Nếu không khớp, chọn child đầu tiên
        setSelectedItem(childs[0].name || _.get(childs[0], 'dataSlice.title') || 'Unnamed');
      }
    }
  }, [childs, currentPath]);

  // Lắng nghe sự kiện click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item: any) => {
    if (item?.value === 'button' && item?.action?.type === 'navigate') {
      console.log(`Navigating to page: ${item.action.pageId}`);
    }
    setSelectedItem(item?.name || _.get(item, 'dataSlice.title') || 'Unnamed');
    setIsOpen(false);
  };

  const renderChild = (child: any) => {
    if (!child || !child.value) return null;

    switch (child.value) {
      case 'button':
        return (
          <button
            onClick={() => handleItemClick(child)}
            className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors ${buttonChildClass}`}
          >
            {_.get(child, 'dataSlice.title') || child.name || 'Unnamed Button'}
          </button>
        );
      case 'text':
        return (
          <div className={`px-4 py-2 text-gray-700 ${buttonChildClass}`}>
            {_.get(child, 'dataSlice.title') || child.name || 'Unnamed Text'}
          </div>
        );
      case 'dropdown':
        return (
          <Dropdown
            id={child.id || `${id}-child-${Math.random()}`}
            style={child.style || ''}
            data={child || {}}
            childs={child.childs || []}
            menuClassDropdow={menuClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={dropdownRef} className={cn(`relative inline-block`, menuClassDropdow)}>
      <div
        onClick={handleToggle}
        className={`transition-colors flex items-center gap-2 focus:bg-[##ffffff47] ${buttonSelectedClass}`}
      >
        {selectedItem || 'Loading...'} {/* Hiển thị selectedItem hoặc "Loading..." nếu chưa có */}
        <span>
          {isOpen ? (
            <Icon icon="iconamoon:arrow-up-2" width="24" height="24" />
          ) : (
            <Icon icon="iconamoon:arrow-down-2" width="24" height="24" />
          )}
        </span>
      </div>

      {isOpen && (
        <div className={cn('absolute left-0 mt-2 z-10', menuClass)}>
          {childs.length > 0 ? (
            childs.map((item: any, index: number) => (
              <div key={item?.id || index}>{renderChild(item)}</div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No items</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
