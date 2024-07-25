"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SessionUser } from "@/types/user";
import { deleteEvent, getOrganizationEvents } from "@/data/event";
import { EventDialog } from "./create-event";
import { RotatingLines } from "react-loader-spinner"; 
import { FeedEventType } from "@/types/event";
import { Event } from "./event";



export function EventFeed({ user }: { user: SessionUser }) {
  const [events, setEvents] = useState<FeedEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getOrganizationEvents(user,page);

        if(data && data.error){
          setError(data.error)
          return
        }
        const fetchedEvents = data.events;
        //setEvents(prevEvents=>[...prevEvents,...fetchedEvents as any]);
        setEvents((prevEvents) => {
          const newEvents = [...prevEvents, ...fetchedEvents as any];
          // Remove duplicate events by checking the ID
          return Array.from(new Set(newEvents.map(event => event.id))).map(id => newEvents.find(event => event.id === id));
        });


        if(fetchedEvents && fetchedEvents.length<20){
          setShowMore(false);
        }else{
          setShowMore(true)
        }
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [page]);



  const observer = useRef<IntersectionObserver | null>(null);// Intersection Observer to observe the last element

  const lastPostRef=useCallback((node: HTMLDivElement | null)=>{
    if(loading) return;
 // If int. Observer exists of old last element, then remove it
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && showMore){
        setPage(prevPage=>prevPage+1);
      }
    })
    if (node  && observer.current) observer.current.observe(node);

  },[loading,showMore])



  const handleDelete = async (postId: string) => {
    try {
      await deleteEvent(postId);
      setEvents(events.filter((event) => event.id !== postId));
      return true;
    } catch (err) {
      console.error("Failed to delete event:", err);
      throw err;
    }
  };

  return (
    <div className="">
      <EventDialog events={events} setEvents={setEvents}>
        <div className="mt-1 py-3 text-center cursor-pointer bg-slate-400 hover:bg-slate-500 transition-colors rounded-lg text-white font-semibold">
          Create a New Event{" "}
        </div>
      </EventDialog>

        <div className="max-w-2xl mx-auto mt-8 space-y-6 flex flex-col">
          {events && events.length !== 0 ? (
            events.map((event,index) =>{ 
              if(events.length === index+1){

                return <Event
                ref={lastPostRef}
                key={event.id}
                event={event}
                user={user}
                events={events}
                setEvents={setEvents}
                handleDelete={handleDelete}
              />
              }

              return <Event
                key={event.id}
                event={event}
                user={user}
                events={events}
                setEvents={setEvents}
                handleDelete={handleDelete}
              />
            })
          ) : (
            !loading && <p className="text-center text-sm text-gray-400">
              No Events to Display
            </p>
          )}

          
          {loading && (
            <div className=" flex justify-center h-10 ">
              <RotatingLines strokeColor="gray" visible={true} />
            </div>
          )}
          {events && events.length !== 0 && !showMore && (
            <p className="text-sm text-gray-500 text-center">No More Entries</p>
          )}
        </div>
   
        {error && <div className="text-red-500 text-center py-2">{error}</div>}

    </div>
  );
}
