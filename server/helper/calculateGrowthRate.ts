//! Hàm helper tính toán tỷ lệ tăng trưởng
export const calculateGrowthRate = (data: any[], currentMonth: number) => {
    if (currentMonth === 1) return 0;
    const prevMonth = data.find(item => item.month === currentMonth - 1);
    const current = data.find(item => item.month === currentMonth);
    if (!prevMonth || !current) return 0;
    return ((current.count - prevMonth.count) / prevMonth.count * 100).toFixed(2);
};