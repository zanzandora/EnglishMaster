import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import fontkit from '@pdf-lib/fontkit';
import { format } from 'date-fns';

const DownloadCertificate = ({ studentName, courseName }: any) => {
  const generateCertificatePDF = async () => {
    const dateToGive = new Date();
    try {
      const formattedDate = format(new Date(dateToGive), 'd MMMM, yyyy');
      // URL của mẫu chứng chỉ PDF có sẵn
      const url = '/Geometric_Modern_Red_Completion_Certificate.pdf'; // Đường dẫn tới mẫu chứng chỉ

      // Fetch mẫu PDF từ server hoặc từ file local
      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      // Tạo một PDF mới từ mẫu
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      pdfDoc.registerFontkit(fontkit);
      // Lấy trang đầu tiên của tài liệu
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Load font từ file (sử dụng fetch)
      const robotoBytes = await fetch(
        '/fonts/roboto/static/Roboto-Regular.ttf'
      ).then((res) => res.arrayBuffer());
      const roboto = await pdfDoc.embedFont(robotoBytes); // Truyền fontBytes vào đây

      const roboto_italic_Bytes = await fetch(
        '/fonts/roboto/static/Roboto-LightItalic.ttf'
      ).then((res) => res.arrayBuffer());
      const roboto_italic = await pdfDoc.embedFont(roboto_italic_Bytes);

      const great_vibes_Bytes = await fetch(
        '/fonts/great_vibes/GreatVibes-Regular.ttf'
      ).then((res) => res.arrayBuffer());
      const great_vibes = await pdfDoc.embedFont(great_vibes_Bytes);

      // Kích thước trang
      const { width, height } = firstPage.getSize();

      // Chèn các tham số động vào các vị trí trên chứng chỉ
      const nameWidth = great_vibes.widthOfTextAtSize(studentName, 60);
      firstPage.drawText(studentName, {
        x: (width - nameWidth) / 2, // Căn giữa chính xác
        y: height / 2 - 8,
        size: 60,
        font: great_vibes,
      });
      const contentLines = [
        `Has successful completed a ${courseName} course`,
        `give this ${formattedDate}.`,
      ];

      // Vẽ từng dòng text với vị trí y giảm dần
      contentLines.forEach((line, index) => {
        const currentFont = index === 1 ? roboto_italic : roboto;
        const lineWidth = roboto.widthOfTextAtSize(line, 16);
        firstPage.drawText(line, {
          x: (width - lineWidth) / 2,
          y: height / 2 - 70 - index * 24, // Giảm 40px mỗi dòng
          size: 16,
          font: currentFont,
        });
      });

      // Lưu file PDF và tải về
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      saveAs(pdfBlob, `${studentName}_certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div>
      <button
        onClick={generateCertificatePDF}
        className='group relative inline-flex items-center justify-center w-[30px] h-[30px] bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full shadow-lg transform scale-100 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300'
      >
        <svg
          width='20px'
          height='20px'
          className='rotate-0 transition ease-out duration-300 scale-100 group-hover:-rotate-45 group-hover:scale-75'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            stroke-linecap='round'
            stroke-linejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16.9C16.3477 18 15.9 18.4477 15.9 19C15.9 19.5523 16.3477 20 16.9 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H7.1C7.65228 20 8.1 19.5523 8.1 19C8.1 18.4477 7.65228 18 7.1 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11V16.5858L9.70711 15.2929C9.31658 14.9024 8.68342 14.9024 8.29289 15.2929C7.90237 15.6834 7.90237 16.3166 8.29289 16.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071L15.7071 16.7071C16.0976 16.3166 16.0976 15.6834 15.7071 15.2929C15.3166 14.9024 14.6834 14.9024 14.2929 15.2929L13 16.5858V11Z'
              fill='#FFFFFF'
            ></path>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default DownloadCertificate;
