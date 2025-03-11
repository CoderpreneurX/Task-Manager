"use client";
import { useState, useEffect, useRef } from "react";
import { JSX } from "react";

type MenuItem = {
  label: string;
  action: (task: Task) => void;
  icon?: JSX.Element;
};

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
}

type ActionMenuProps = {
  className?: string;
  menuItems: MenuItem[]; // Accepts dynamic menu items
  task: Task;
};

const ActionMenu = ({ className = "", menuItems, task }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="speed-dial-menu-dropdown"
          className="absolute bottom-full right-0 mb-2 py-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-700"
        >
          <ul className="text-sm text-gray-700 dark:text-gray-300">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    item.action(task); // Execute the action
                    setIsOpen(false); // Close menu after clicking
                  }}
                  className="flex w-full text-left items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                >
                  {item.icon}
                  <span className="ml-2 font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        aria-controls="speed-dial-menu-dropdown"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 16"
        >
          <circle cx="2" cy="2" r="1.5" /> {/* Top dot */}
          <circle cx="2" cy="8" r="1.5" /> {/* Middle dot */}
          <circle cx="2" cy="14" r="1.5" /> {/* Bottom dot */}
        </svg>

        <span className="sr-only">Open actions menu</span>
      </button>
    </div>
  );
};

export default ActionMenu;
