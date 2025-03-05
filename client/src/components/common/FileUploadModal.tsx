import { useState } from 'react';

export default function FileUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      {/* Nút mở modal */}
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700'
      >
        Upload File
      </button>

      {/* Hiển thị file bên cạnh nút */}
      {selectedFile && (
        <div className='flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-100'>
          {/* Hiển thị tên file */}
          <p className='text-blue-600 text-sm truncate w-[150px]'>
            {selectedFile.name}
          </p>

          {/* Nếu là ảnh, hiển thị preview */}
          {selectedFile.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt='Preview'
              className='w-10 h-10 object-cover rounded-md border'
            />
          )}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>
              Upload Your File
            </h2>

            {/* Khu vực kéo thả file */}
            <div className='relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out'>
              <div className='absolute flex flex-col items-center'>
                <img
                  alt='File Icon'
                  className='mb-3'
                  src='https://img.icons8.com/dusk/64/000000/file.png'
                />
                <span className='block text-gray-500 font-semibold'>
                  Drag &amp; drop your files here
                </span>
                <span className='block text-gray-400 font-normal mt-1'>
                  or click to upload
                </span>
              </div>

              <input
                className='h-full w-full opacity-0 cursor-pointer'
                type='file'
                multiple={true}
                onChange={handleFileChange}
              />
            </div>

            {/* Nút đóng modal */}
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => setIsOpen(false)}
                className='px-4 py-2 bg-gray-400 text-white font-medium rounded-md shadow hover:bg-gray-500'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
