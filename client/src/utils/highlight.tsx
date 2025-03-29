import React from 'react';

// Hàm chuẩn hóa tiếng Việt (bỏ dấu)
const normalizeVietnamese = (str: string): string => {
  return str
    .normalize('NFD') // Tách ký tự thành base và dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D'); // Xử lý đ/Đ
};

export const highlightText = (
  text: string,
  query: string
): (string | React.ReactElement)[] => {
  if (!text || !query) return [text];

  const normalizedText = normalizeVietnamese(text);
  const normalizedQuery = normalizeVietnamese(query);

  const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi');

  // Tìm các match dựa trên text đã chuẩn hóa
  const matches = Array.from(normalizedText.matchAll(regex));
  const parts = [];
  let lastIndex = 0;

  for (const match of matches) {
    const start = match.index!;
    const end = start + match[0].length;

    // Thêm phần không match trước đó
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    // Thêm phần match (dùng text gốc)
    parts.push(
      <mark key={lastIndex} className='bg-yellow-100'>
        {text.slice(start, end)}
      </mark>
    );

    lastIndex = end;
  }

  // Thêm phần còn lại sau match cuối cùng
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
