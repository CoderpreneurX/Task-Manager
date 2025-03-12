"use client";

import { useState, useEffect } from "react";
import { 
  Bars3Icon, XMarkIcon, HomeIcon, UserCircleIcon 
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

interface SidebarItemProps {
  icon: JSX.Element;
  text: string;
  href: string;
  isOpen: boolean;
}

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<string>("64px"); // Default width
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/");
    window.location.reload()
  };

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 1024);

      if (screenWidth <= 1024 && isOpen) {
        const maxSidebarWidth = Math.min(256, (4 / 6) * screenWidth);
        setSidebarWidth(`${maxSidebarWidth}px`);
      } else if (screenWidth <= 1024 && !isOpen) {
        setSidebarWidth("80px");
      } else {
        setSidebarWidth(isOpen ? "256px" : "64px");
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpen]);

  return (
    <div className="flex h-screen">
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`bg-gray-900 text-white h-full p-5 pt-8 transition-all duration-300 flex flex-col z-50
        ${isMobile && isOpen ? "fixed left-0 top-0 shadow-lg" : "relative"}`}
        style={{ width: sidebarWidth }}
      >
        <button
          className="mb-6 flex items-center justify-start rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>

        <nav className="flex flex-col space-y-2 flex-grow">
          <SidebarItem icon={<HomeIcon className="h-6 w-6" />} text="Tasks" href="/tasks" isOpen={isOpen} />
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="relative mt-auto">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-md hover:bg-gray-800 w-full text-left"
            >
              <UserCircleIcon className="h-8 w-8" />
              {isOpen && <span className="text-sm">{user.email}</span>}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute bottom-12 left-0 w-48 bg-gray-800 shadow-lg rounded-md">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, href, isOpen }) => {
  return (
    <Link href={href}>
      <div className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer">
        <div className="flex justify-center items-center min-w-[24px] min-h-[24px]">
          {icon}
        </div>
        {isOpen && <span className="text-sm ml-4">{text}</span>}
      </div>
    </Link>
  );
};
