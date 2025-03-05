import { useMemo } from 'react';

interface RelationMap {
  [key: string]: Map<any, any>;
}

const useRelationMapper = (data: any[], relations: { [key: string]: any[] }): any[] => {
  return useMemo(() => {
    if (!Array.isArray(data) || typeof relations !== 'object') {
      return [];
    }

    if (Object.keys(relations).length === 0) {
      return data;
    }

    // Tạo Map cho từng bảng quan hệ
    const relationMaps: RelationMap = Object.fromEntries(
      Object.entries(relations).map(([key, values]) => [
        key,
        new Map(values.map((item) => [item.id, item])), // Sử dụng `id` làm khóa chính
      ])
    );

    try {
      return data.map((item) => {
        const newItem = { ...item };

        // Ánh xạ classId
        if (item.classId && relationMaps.classId) {
          newItem.classId = relationMaps.classId.get(item.classId) || null;
        }

        // Ánh xạ studentId (nếu cần)
        if (item.studentId && relationMaps.studentId) {
          newItem.studentId = relationMaps.studentId.get(item.studentId) || null;
        }

        return newItem;
      });
    } catch (error) {
      console.error('Error mapping relations:', error);
      return data;
    }
  }, [data, relations]);
};

export default useRelationMapper;