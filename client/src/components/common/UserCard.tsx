const UserCard = ({ type }: { type: string }) => {
  return (
    <div className='rounded-2xl odd:bg-primary even:bg-secondary p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>
          2024/25
        </span>
      </div>
      <h1 className='text-2xl font-bold my-4'>1,234</h1>
      <h2 className='capitalize text-sm font-medium text-zinc-700'>{type}s</h2>
    </div>
  );
};

const RevenueCard = ({ revenue }: { revenue: number }) => {
  return (
    <div className='rounded-2xl bg-secondary p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>
          This month
        </span>
      </div>
      <h1 className='text-2xl font-bold my-4'>${revenue.toLocaleString()}</h1>
      <h2 className='capitalize text-sm font-medium text-zinc-700'>Revenue</h2>
    </div>
  );
};

export { UserCard, RevenueCard };
