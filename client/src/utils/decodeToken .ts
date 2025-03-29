/**
 * Hàm giải mã JWT token
 * @param token - JWT token cần giải mã
 * @returns - Đối tượng chứa thông tin giải mã từ token
 */
export const decodeToken = (token: string | null): { [key: string]: any } | null => {
  try {
    const base64Url = token.split('.')[1]; // Lấy phần payload từ JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Thay thế các ký tự đặc biệt
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    ); // Giải mã base64 và chuyển thành JSON

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
