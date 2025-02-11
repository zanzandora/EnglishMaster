  
interface SlotInfo {
    start: Date;
    end: Date;
}

interface Event {
    id?: number;
    title:  string;
    start: Date;
    end: Date;
    resource?: any;
}

type SetState<T> = (value: T) => void;

export const handleSelectSlot = (
    slotInfo: SlotInfo,
    setNewEvent: SetState<Event>,
    setEditing: SetState<boolean>,
    setShowPopup: SetState<boolean>
) => {
    setNewEvent({ title: '', start: slotInfo.start, end: slotInfo.end });
    setEditing(false);
    setShowPopup(true);
};

export const handleSelectEvent = (
    event: Event,
    events: Event[],
    setNewEvent: SetState<Event>,
    setEditing: SetState<boolean>,
    setShowPopup: SetState<boolean>
) => {
    setNewEvent({
        id: events.findIndex((e) => e.start === event.start && e.end === event.end),
        title: typeof event.title === "string" ? event.title : String(event.title) || "",
        start: event.start,
        end: event.end,
        resource: event.resource,
    });
    setEditing(true);
    setShowPopup(true);
};

export const handleSaveEvent = (
    newEvent: Event,
    editing: boolean,
    events: Event[],
    setEvents: SetState<Event[]>,
    setShowPopup: SetState<boolean>
) => {
    if (!newEvent.title) return;
    if (editing && newEvent.id !== undefined) {
        setEvents(events.map((e, i) => (i === newEvent.id ? { ...newEvent } : e)));
    } else {
        setEvents([...events, { ...newEvent }]);
    }
    setShowPopup(false);
};

export const handleDeleteEvent = (
    newEvent: Event,
    editing: boolean,
    events: Event[],
    setEvents: SetState<Event[]>,
    setShowPopup: SetState<boolean>
) => {
    if (editing && newEvent.id !== undefined) {
        setEvents(events.filter((_, i) => i !== newEvent.id));
    }
    setShowPopup(false);
};

  
  
