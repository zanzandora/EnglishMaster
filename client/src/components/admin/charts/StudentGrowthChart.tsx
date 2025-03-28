import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useMonthlyGrowth } from 'hooks/useFetchDatas';

const data = [
  {
    name: 'Jan',
    growth: 30,
  },
  {
    name: 'Feb',
    growth: 50,
  },
  {
    name: 'Mar',
    growth: 70,
  },
  {
    name: 'Apr',
    growth: 90,
  },
  {
    name: 'May',
    growth: 110,
  },
  {
    name: 'Jun',
    growth: 130,
  },
  {
    name: 'Jul',
    growth: 219,
  },
  {
    name: 'Aug',
    growth: 170,
  },
  {
    name: 'Sep',
    growth: 190,
  },
  {
    name: 'Oct',
    growth: 210,
  },
  {
    name: 'Nov',
    growth: 230,
  },
  {
    name: 'Dec',
    growth: 20,
  },
];

const StudentGrowthChart = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useMonthlyGrowth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold capitalize'>
          {t('chart.title.studentGrowth')}
        </h1>
      </div>
      <ResponsiveContainer width='100%' height='90%'>
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#ddd' />
          <XAxis
            dataKey='name'
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [
              <span key='value' className='text-indigo-600 font-semibold'>
                {value.toLocaleString()}
              </span>,
              <span key='label' className='text-gray-600'>
                {t('chart.legend.growth')}
              </span>,
            ]}
          />
          <Legend
            align='left'
            verticalAlign='top'
            wrapperStyle={{ paddingBottom: '20px' }}
            formatter={() => (
              <span className='text-gray-600 text-sm'>
                {t('chart.legend.growth')}
              </span>
            )}
          />
          <Bar
            dataKey='growth'
            fill='var(--color-charts-barChart-barColor_A)'
            legendType='circle'
            radius={[10, 10, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentGrowthChart;
