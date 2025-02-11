export default function ErrorPage() {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <div className='max-w-md px-4 py-8 bg-white shadow-lg rounded-lg'>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-gray-800'>Error</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    </div>
  );
}
