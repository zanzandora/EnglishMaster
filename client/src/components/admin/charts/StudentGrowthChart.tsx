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
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Monthly Student Growth</h1>
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
          <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }}
          />
          <Legend
            align='left'
            verticalAlign='top'
            wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
          />
          <Bar
            dataKey='growth'
            fill='var(--color-charts-barChart-barColor_A)'
            legendType='circle'
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentGrowthChart;
