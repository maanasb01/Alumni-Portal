"use client"
import React, { useState, useRef, useEffect} from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { ConfirmationDialog } from './confirmation-dialog';

interface DropdownMenuProps {

    handleDeleteUser: () => Promise<void>;
}

export function DropdownMenu({ handleDeleteUser }:DropdownMenuProps){
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement | undefined>(null);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
   
    if (menuRef.current && !menuRef.current.contains(event.target as Node) || dialogRef.current && dialogRef.current.contains(event.target as Node)) {
        // Do nothing, keep the dropdown open
      } else if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Click was outside the dropdown menu and not inside the dialog, so close the dropdown
        setIsOpen(false);
      }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className="p-2 hover:text-gray-300"
        onClick={handleToggleMenu}
      >
        <FaEllipsisV />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">

          <ConfirmationDialog
          ref={dialogRef as any}
          
              message="Are you sure you want to delete your Profile Permanently?"
              actionFunction={()=>{
                
                handleDeleteUser()
                }}>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
                
                
              >
                Delete User
              </button>
          </ConfirmationDialog>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
