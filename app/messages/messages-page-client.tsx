"use client"

import { useState, useEffect } from "react"
import { Search, Send, Smile, Paperclip } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Calendar, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

// Define a type for the event objects
interface Event {
  id: number;
  title: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  featured: boolean;
  attendees: number;
  imageUrl: string;
}

export default function EventsPageClient() {
  // State for events
  const [events, setEvents] = useState<Event[]>([]);

  // State for modal visibility and selected event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://bfk8w11dpc.execute-api.ap-south-1.amazonaws.com/prod/events/list");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Function to handle opening the modal
  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Discover events, workshops, and festivals in the creative industry
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Events List */}
        <div className="space-y-6">
          {/* Events */}
          <div className="space-y-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className={cn(
                  "p-6 bg-ink-light border-ink hover:border-primary/50 transition-colors",
                  event.featured && "border-l-4 border-l-primary",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white hover:text-primary">
                          {event.title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {event.organizer}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="border-ink text-white">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                      </Badge>
                      <Badge variant="outline" className="border-ink text-white">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </Badge>
                    </div>
                    <p className="mt-3 text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ink">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {event.attendees} attendees
                      </div>
                      <div className="ml-auto">
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => handleOpenModal(event)}>Event Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              <img src={selectedEvent?.imageUrl} alt={selectedEvent?.title} className="w-full h-auto mb-4" />
              <p>{selectedEvent?.description}</p>
              <p><strong>Organizer:</strong> {selectedEvent?.organizer}</p>
              <p><strong>Location:</strong> {selectedEvent?.location}</p>
              <p><strong>Date:</strong> {selectedEvent?.date}</p>
              <p><strong>Attendees:</strong> {selectedEvent?.attendees}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

