import { useState, useRef, useEffect } from 'react';

const initialNotifications = [
  {
    id: '1',
    title: 'Bài tập mới được giao',
    isUnRead: true,
    time: '2 phút trước',
  },
  {
    id: '2',
    title: 'Bạn có một tin nhắn mới',
    isUnRead: true,
    time: '10 phút trước',
  },
  {
    id: '3',
    title: 'Lịch học tuần này đã được cập nhật',
    isUnRead: false,
    time: '1 giờ trước',
  },
  {
    id: '4',
    title: 'Giáo viên đã chấm điểm bài kiểm tra',
    isUnRead: false,
    time: 'Hôm qua',
  },
];

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Chia thông báo thành 2 nhóm
  const unreadNotifications = notifications.filter((n) => n.isUnRead);
  const readNotifications = notifications.filter((n) => !n.isUnRead);
  const unreadCount = unreadNotifications.length;

  // Đóng popover khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isUnRead: false,
      }))
    );
  };

  return (
    <div className='relative' ref={popoverRef}>
      {/* Nút thông báo */}
      <button
        className='relative p-2 bg-white rounded-full hover:bg-gray-200'
        onClick={() => setOpen(!open)}
      >
        {/* 🔔 */}
        <img src='/announcement.png' alt='' width={30} height={30} />

        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full'></span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div className='absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
          <div className='p-3 border-b flex justify-between items-center'>
            <span className='text-gray-700 font-semibold'>Thông báo</span>
            {unreadCount > 0 && (
              <button className='text-blue-500 text-sm' onClick={markAllAsRead}>
                Đã đọc
              </button>
            )}
          </div>

          <div className='max-h-64 overflow-y-auto'>
            {/* Thông báo chưa đọc */}
            {unreadNotifications.length > 0 && (
              <div>
                <p className='text-xs font-semibold text-gray-600 px-3 pt-2 py-2 pb-3 uppercase'>
                  News
                </p>
                {unreadNotifications.map((noti) => (
                  <div
                    key={noti.id}
                    className='p-3 border-b bg-gray-100 hover:bg-gray-200 cursor-pointer'
                  >
                    <p className='text-sm'>{noti.title}</p>
                    <span className='text-xs text-gray-500'>{noti.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Thông báo đã đọc */}
            {readNotifications.length > 0 && (
              <div>
                <p className='text-xs font-semibold text-gray-600 px-3 pt-2 py-2 pb-3 uppercase'>
                  Before that
                </p>
                {readNotifications.map((noti) => (
                  <div
                    key={noti.id}
                    className='p-3 border-b hover:bg-gray-100 cursor-pointer'
                  >
                    <p className='text-sm'>{noti.title}</p>

                    <span className='text-xs text-gray-500'>{noti.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Nếu không có thông báo */}
            {notifications.length === 0 && (
              <p className='p-3 text-gray-500 text-sm text-center'>
                Không có thông báo nào
              </p>
            )}
          </div>
          <div className='p-3 border-t'>
            <button className='w-full text-blue-500 text-sm'>View all</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
