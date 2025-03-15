import { useState, useEffect } from 'react';


export const useFetchClassesOptions   = () => {
    const [classOptions, setClassOptions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/class/options');
                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu');
                }
                const data = await response.json();
                setClassOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    return { classOptions, loading, error };
};

export const useFetcTeachersOptions = () => {
    const [teacherOptions, setClassOptions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/teacher/options');
                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu');
                }
                const data = await response.json();
                setClassOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    return { teacherOptions, loading, error };
};
export const useFetchCoursesOptions = () => {
    const [courseOptions, setCourseOptions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/course/options');
                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu');
                }
                const data = await response.json();
                setCourseOptions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    return { courseOptions, loading, error };
};

