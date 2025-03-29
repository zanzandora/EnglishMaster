import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Notification } from '@interfaces';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@utils/dateUtils';

const socket = io('http://localhost:5173');

const formatTime = (createdAt: Date) => {
  const now = new Date();
  const timeDifference = now.getTime() - new Date(createdAt).getTime();
  const minutes = Math.floor(timeDifference / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return 'Now';
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (days === 1) {
    return 'Yesterday ' + formatDate(createdAt, 'HH:mm');
  }
  return formatDate(createdAt, 'HH:mm yyyy-MM-dd');
};

const NotificationsPopover = () => {
  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;
  const userID = decodedToken?.user_id;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Chia thông báo thành 2 nhóm
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);
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

  // Lắng nghe sự kiện "newNotification" từ server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/notification', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch teache: ${response.statusText}`);
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();

    if (userID && role === 'teacher') {
      socket.emit('subscribe', userID);
    }

    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [
        {
          id: prevNotifications.length + 1,
          userId: notification.userID,
          title: notification.title, // Cập nhật title
          message: notification.message, // Cập nhật message
          isRead: false,
          createdAt: new Date(),
          relatedEntityType: notification.relatedEntityType, // Loại entity
          time: 'Now',
        },
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [role, userID]);

  const markAllAsRead = async () => {
    try {
      // Gọi API để đánh dấu tất cả là đã đọc
      await fetch('/notification/markAllAsRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // Cập nhật state local
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const goToNotifications = () => {
    setOpen(false);
    navigate(`/${role}/list/announcements`);
  };

  return (
    <div className='relative' ref={popoverRef}>
      {/* Nút thông báo */}
      <button
        className='relative p-2 bg-white rounded-full hover:bg-gray-200'
        onClick={() => setOpen(!open)}
      >
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
                  New
                </p>
                {unreadNotifications.map((noti) => (
                  <div
                    key={noti.id}
                    className='p-3 border-b bg-gray-100 hover:bg-gray-200 cursor-pointer'
                  >
                    <p className='text-sm'>{noti.title}</p>
                    <span className='text-xs text-gray-500'>
                      {formatTime(noti.createdAt)}
                    </span>
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

                    <span className='text-xs text-gray-500'>
                      {formatTime(noti.createdAt)}
                    </span>
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
            <button
              onClick={goToNotifications}
              className='w-full text-blue-500 text-sm'
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
