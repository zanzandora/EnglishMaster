export interface ExtendedEvent {
  id: string | number;
  title: string; // Dùng className làm tiêu đề
  start: Date;
  end: Date;
  resource: number; // Dùng room làm resource (số)
  data: {
    id: number;
    classID: number;
    className: string;
    type: 'class' | 'exam';
    repeatRule: string;
    daysOfWeek?: number[];
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    teacher: string;
    course?: string;
    room: number;
  };
}
