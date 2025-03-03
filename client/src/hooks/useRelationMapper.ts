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

    const relationMaps: RelationMap = new Map(
      Object.entries(relations).map(([key, values]) => [
        key,
        new Map(values.map((item) => [item[key], item])),
      ])
    );

    try {
      return data.map((item) => {
        return Object.keys(relations).reduce((acc, key) => {
          acc[key] = relationMaps.get(key)?.get(item[key]) || null;
          return acc;
        }, { ...item });
      });
    } catch (error) {
      console.error('Error mapping relations:', error);
      return data;
    }
  }, [data, relations]);
};

export default useRelationMapper;