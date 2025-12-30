import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GenerationState } from '../types';
import { exportToDocx } from '../services/exportService';

interface ResultDisplayProps {
  state: GenerationState;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ state }) => {
  const handleCopy = () => {
    if (state.result) {
      navigator.clipboard.writeText(state.result);
      alert('Đã sao chép nội dung vào bộ nhớ tạm!');
    }
  };

  const handleDownload = async () => {
    if (state.result) {
        try {
            await exportToDocx(state.result, 'Giao_An_CV2345.docx');
        } catch (error) {
            console.error(error);
            alert('Có lỗi khi tạo file Word. Vui lòng thử lại.');
        }
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-gray-50/50">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800">AI đang suy nghĩ...</h3>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          Hệ thống đang phân tích yêu cầu và hình ảnh để soạn giáo án chuẩn CV 2345.
          <br />Quá trình này có thể mất vài giây.
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Đã xảy ra lỗi</h3>
        <p className="text-gray-500 mt-2 mb-6">{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  if (!state.result) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có kết quả</h3>
        <p className="text-gray-500 max-w-sm">
          Điền thông tin vào cột bên trái và tải lên ảnh chụp SGK (nếu có), sau đó nhấn "Bắt đầu soạn giáo án".
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Kế hoạch bài dạy đã tạo
        </h3>
        <div className="flex gap-2">
            <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải Word (.docx)
            </button>
            <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Sao chép
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 min-h-[500px] prose prose-emerald max-w-none font-serif leading-relaxed text-gray-800">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
            >
                {state.result}
            </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};