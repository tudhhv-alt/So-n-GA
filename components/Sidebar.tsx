import React, { useRef, useState } from 'react';
import { BookSet, Grade, LessonFormData } from '../types';
import { BOOK_SETS, GRADES } from '../constants';

interface SidebarProps {
  onSubmit: (data: LessonFormData) => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LessonFormData>({
    bookSet: BookSet.CANH_DIEU,
    grade: Grade.LOP_3,
    subject: '',
    lessonName: '',
    periods: 1,
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm z-10 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
          <h2 className="text-emerald-800 font-semibold mb-1">Thông tin bài dạy</h2>
          <p className="text-xs text-emerald-600">Điền đầy đủ thông tin để AI soạn bài chính xác nhất.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bộ sách */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bộ sách</label>
            <div className="relative">
              <select
                name="bookSet"
                value={formData.bookSet}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border bg-white"
              >
                {BOOK_SETS.map((book) => (
                  <option key={book.value} value={book.value}>{book.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Khối lớp */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border bg-white"
              >
                {GRADES.map((grade) => (
                  <option key={grade.value} value={grade.value}>{grade.label}</option>
                ))}
              </select>
            </div>
            {/* Số tiết */}
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiết</label>
              <input
                type="number"
                name="periods"
                min={1}
                max={5}
                value={formData.periods}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border"
              />
            </div>
          </div>

          {/* Môn học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <input
              type="text"
              name="subject"
              placeholder="VD: Toán, Tiếng Việt, Tin học..."
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border"
            />
          </div>

          {/* Tên bài học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài học</label>
            <input
              type="text"
              name="lessonName"
              placeholder="Nhập tên bài hoặc để trống nếu dùng ảnh"
              value={formData.lessonName}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1">Tài liệu (Ảnh SGK, PDF)</label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${previewUrl ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    {formData.image?.type === 'application/pdf' ? (
                       <div className="mx-auto h-32 w-32 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-gray-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                         </svg>
                         <span className="text-xs px-2 text-center w-full truncate font-medium">{formData.image.name}</span>
                       </div>
                    ) : (
                       <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-contain rounded-md" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, image: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Đã chọn tài liệu</p>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                        <span>Tải tài liệu lên</span>
                      </span>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG tối đa 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50">
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!formData.subject && !formData.image)}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white uppercase tracking-wider
            ${isLoading || (!formData.subject && !formData.image)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang soạn...
            </span>
          ) : 'Bắt đầu soạn giáo án'}
        </button>
      </div>
    </div>
  );
};