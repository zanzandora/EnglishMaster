  
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
    setView: React.Dispatch<React.SetStateAction<View>>,
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  ) => {
    // Chuyển sang week view
    setView('week');
    // Đặt current date thành ngày bắt đầu của event
    setCurrentDate(new Date(event.start));
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

  
  
