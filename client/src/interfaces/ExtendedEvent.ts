export interface ExtendedEvent {
  id: string | number;
  title: string; // Đảm bảo đây là string
  start: Date;
  end: Date;
  resource: string;
  data: {
    subject?: string;
    class?: string;
    room?: string;
    teacher?: string;
    type?: string; // Để xác định màu sắc
  };
}
