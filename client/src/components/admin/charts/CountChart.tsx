import { useFetchCountGenders } from 'hooks/useFetchDatas';
import { useTranslation } from 'react-i18next';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CountChart = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchCountGenders();

  // Tính phần trăm
  const total = data.find((item) => item.name === 'Total')?.count || 1;
  const boysCount = data.find((item) => item.name === 'Boys')?.count || 0;
  const girlsCount = data.find((item) => item.name === 'Girls')?.count || 0;
  const boysPercentage = Math.round((boysCount / total) * 100);
  const girlsPercentage = Math.round((girlsCount / total) * 100);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      {/* TITLE */}
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold capitalize'>
          {t('chart.title.students')}
        </h1>
        <img src='/moreDark.png' alt='' width={20} height={20} />
      </div>
      {/* CHART */}
      <div className='relative w-full h-[75%]'>
        <ResponsiveContainer>
          <RadialBarChart
            cx='50%'
            cy='50%'
            innerRadius='60%'
            outerRadius='80%'
            barSize={32}
            data={data.filter((item) => item.name !== 'Total')}
          >
            <RadialBar background dataKey='count' />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div>
                      <p className='z-50'>{payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <img
          src='/maleFemale.png'
          alt=''
          width={80}
          height={50}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        />
      </div>
      {/* BOTTOM */}
      <div className='flex justify-center gap-16'>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-secondary-male rounded-full' />
          <h1 className='font-bold'>{boysCount.toLocaleString()}</h1>
          <h2 className='text-xs text-gray-500 capitalize'>
            {t('chart.label.boys')} ({boysPercentage}%)
          </h2>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-secondary-female  rounded-full' />
          <h1 className='font-bold'>{girlsCount.toLocaleString()}</h1>
          <h2 className='text-xs text-gray-500 capitalize'>
            {t('chart.label.girls')} ({girlsPercentage}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
