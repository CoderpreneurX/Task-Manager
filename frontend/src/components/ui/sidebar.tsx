import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Sidebar Item Props Type
interface SidebarItemProps {
  icon: JSX.Element;
  text: string;
  href: string;
  isOpen: boolean;
}

// Sidebar Component
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<string>("256px"); // Default width

  // Detect screen width and update `isMobile` & `sidebarWidth`
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 1024);

      if (screenWidth <= 1024 && isOpen) {
        // Sidebar width should be `w-64` (256px) or `4/6 * screenWidth`, whichever is smaller
        const maxSidebarWidth = Math.min(256, (4 / 6) * screenWidth);
        setSidebarWidth(`${maxSidebarWidth}px`);
      } else if (screenWidth <= 1024 && !isOpen) {
        setSidebarWidth("80px"); // w-20 when collapsed on mobile
      } else {
        setSidebarWidth(isOpen ? "256px" : "64px"); // Default behavior on larger screens
      }
    };

    updateSize(); // Initial check
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpen]);

  return (
    <div className="flex h-screen">
      {/* Sidebar Background Overlay (only when open on mobile) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed when open, Relative otherwise */}
      <div
        className={`bg-gray-900 text-white h-full p-5 pt-8 transition-all duration-300 flex flex-col z-50
        ${isMobile && isOpen ? "fixed left-0 top-0 shadow-lg" : "relative"}`}
        style={{ width: sidebarWidth }}
      >
        {/* Toggle Button */}
        <button
          className="mb-6 flex items-center justify-start rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>

        {/* Sidebar Content */}
        <nav className="flex flex-col space-y-2">
          <SidebarItem icon={<HomeIcon />} text="Tasks" href="/tasks" isOpen={isOpen} />
        </nav>
      </div>
    </div>
  );
}

// Sidebar Item Component
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
