"use client"
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { EventDialog } from "./create-event";
import { FeedEventType } from "@/types/event";
import { SessionUser } from "@/types/user";
import { Dispatch, forwardRef, LegacyRef, SetStateAction } from "react";
import { ConfirmationDialog } from "../../confirmation-dialog";
import Link from "next/link";
import { formatDate } from "@/lib/post-event";



export const Event = forwardRef(
  (
    {
      event,
      user,
      events,
      setEvents,
      handleDelete,
    }: {
      event: FeedEventType;
      user: SessionUser;
      events: FeedEventType[];
      setEvents: Dispatch<SetStateAction<FeedEventType[]>>;
      handleDelete: (id: string) => void;
    },
    ref: LegacyRef<HTMLDivElement> | undefined
  ) => {
    const isOrganizer = event.organizerId === user.id;
    return (
      <div
        ref={ref}
        className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6 w-full "
      >
        <div className="relative">
          <div className="bg-indigo-500 h-2 w-full absolute top-0 left-0"></div>
          <div className="p-6">
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">{event.title}</h1>
            <p className="mt-2 text-gray-600">{event.description}</p>
            <div className="mt-4">
              <span className="text-sm text-gray-600 ">Organized by: <Link className="font-semibold" href={`/profile/${event.organizerId}`}>{event.organizer.name}</Link></span>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600 mr-2">Fee:</span>
                <span className="text-sm text-black">{event.fee === 0 ? 'Free' : `${event.currency.currencySymbol}${event.fee}`}</span>
              </div>
            </div>
            {isOrganizer && (
              <div className="mt-4 flex space-x-4">
                <EventDialog event={event} events={events} setEvents={setEvents}>
                  <button className="flex items-center text-blue-500 hover:text-blue-700">
                    <FiEdit className="mr-1" /> Edit
                  </button>
                </EventDialog>
                <ConfirmationDialog actionFunction={() => handleDelete(event.id)} message="Are you sure you want to delete the event?">
                  <button className="flex items-center text-red-500 hover:text-red-700">
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </ConfirmationDialog>
              </div>
            )}
            <div className="mt-2 text-gray-500 text-xs">
            <span>{`Posted on ${formatDate(event.createdAt)}`}</span>
            {event.createdAt < event.updatedAt && (
              <span className="ml-2">
                (edited on {formatDate(event.updatedAt)})
              </span>
            )}
          </div>
          </div>
        </div>
      </div>
    );
  }
);

Event.displayName="Event"