import { useFetchTotalUsers } from 'hooks/useFetchDatas';
import { useTranslation } from 'react-i18next';

const UserCard = ({ type }: { type: string }) => {
  const { data } = useFetchTotalUsers();
  const date = new Date();

  return (
    <div className='rounded-2xl odd:bg-primary even:bg-secondary p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>
          {date.toISOString().split('T')[0]}
        </span>
      </div>
      <h1 className='text-2xl font-bold my-4'>
        {type === 'students' ? data.students : data.teachers}
      </h1>
      <h2 className='capitalize text-sm font-medium text-zinc-700'>{type}</h2>
    </div>
  );
};

const RevenueCard = ({ revenue }: { revenue: number }) => {
  const { t } = useTranslation();
  return (
    <div className='rounded-2xl bg-secondary p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>
          This month
        </span>
      </div>
      <h1 className='text-2xl font-bold my-4'>${revenue.toLocaleString()}</h1>
      <h2 className='capitalize text-sm font-medium text-zinc-700'>
        {t('card.label.revenue')}
      </h2>
    </div>
  );
};

export { UserCard, RevenueCard };
