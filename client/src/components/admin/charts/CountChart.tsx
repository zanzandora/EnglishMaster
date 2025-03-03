import { useTranslation } from 'react-i18next';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Girls',
    count: 53,
    fill: 'mediumvioletred',
  },
  {
    name: 'Boys',
    count: 53,
    fill: 'dodgerblue',
  },
];

const CountChart = () => {
  const { t } = useTranslation();
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
            innerRadius='40%'
            outerRadius='100%'
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey='count' />
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
          <h1 className='font-bold'>1,234</h1>
          <h2 className='text-xs text-gray-500 capitalize'>
            {t('chart.label.boys')} (55%)
          </h2>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-secondary-female  rounded-full' />
          <h1 className='font-bold'>1,234</h1>
          <h2 className='text-xs text-gray-500 capitalize'>
            {t('chart.label.girls')} (45%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
