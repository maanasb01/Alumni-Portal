"use client";

import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/config/sidebarLinks";

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLDivElement>(null);

  // State Changes on Resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLargeScreen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

// To Make sure in small screens, sidebar gets closed when touched anywhere else
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsLargeScreen(window.innerWidth > 1024);
  };

  return (
    <>
      {/* Navigation Toggle Button - Hide on Large Screens */}
      <button
        type="button"
        className={`text-gray-500 hover:text-gray-600 lg:hidden absolute top-1 left-1`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <RxHamburgerMenu size={26} />
      </button>
      {/* End Navigation Toggle Button */}

      {/* Sidebar - Use Overlay on Small Screens */}
      <div
        ref={sidebarRef}
        className={clsx(
          isOpen && !isLargeScreen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 transform fixed top-0 start-0 bottom-0 z-50 w-64 bg-gray-100  border-r-2 border-gray-300 pt-7 pb-10 overflow-y-auto lg:static lg:translate-x-0  lg:pt-0 lg:pb-0 lg:overflow-y-auto lg:w-full lg:h-full lg:block "
        )}
      >
        {!isLargeScreen && (
          <div className="px-6">
            <Link
              href="/"
              className="text-xl font-semibold dark:text-white"
              aria-label="Brand"
            >
              Alumni Portal
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-6 w-full flex flex-col">
          <ul className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <li key={link.name+link.href}>
                  <Link
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-x-3.5 py-2 px-2.5  text-gray-700 rounded-lg  hover:text-white dark:bg-neutral-700 dark:text-white",
                      {
                        "bg-slate-500 text-white hover:bg-slate-500":
                          pathname === link.href,
                          "  hover:bg-slate-400":
                          pathname !== link.href,
                      }
                    )}
                  >
                    <LinkIcon />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* End Navigation Items */}
      </div>
      {/* End Sidebar */}
    </>
  );
};
