import { useState } from 'react';
const faqs = [
  {
    question: 'Tôi quên mật khẩu, làm sao để khôi phục?',
    answer:
      "Nhấn vào 'Quên mật khẩu' trên trang đăng nhập, nhập email của bạn và làm theo hướng dẫn.",
  },
  {
    question: 'Tôi có thể thay đổi email đăng ký không?',
    answer: 'Có, bạn có thể thay đổi email trong phần Cài đặt tài khoản.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='min-w-12 h-full m-4 rounded-md p-6 bg-white'>
      <h1 className='text-2xl font-bold mb-4 ml-7'>Câu hỏi thường gặp (FAQ)</h1>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border rounded-lg shadow-sm'>
            <button
              className='w-full text-left px-4 py-3 font-medium flex justify-between items-center'
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className='text-lg'>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className='px-4 py-3 bg-gray-100 border-t'>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
