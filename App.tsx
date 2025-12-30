import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResultDisplay } from './components/ResultDisplay';
import { LessonFormData, GenerationState } from './types';
import { generateLessonPlan } from './services/geminiService';

const App: React.FC = () => {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleFormSubmit = async (data: LessonFormData) => {
    setGenerationState({
      isLoading: true,
      result: null,
      error: null,
    });

    try {
      const result = await generateLessonPlan(data);
      setGenerationState({
        isLoading: false,
        result: result,
        error: null,
      });
    } catch (error: any) {
      setGenerationState({
        isLoading: false,
        result: null,
        error: error.message || "Đã xảy ra lỗi không xác định.",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg flex-shrink-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">
              Soạn Giáo Án Theo CV 2345/BGDĐT-GDTH
            </h1>
            <p className="text-xs text-emerald-200 mt-0.5">
              Hỗ trợ tích hợp Thông tư 02/2025/TT-BGDĐT & Phát triển năng lực số
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-emerald-800/50 py-1 px-3 rounded-full text-xs border border-emerald-600">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar (Input) */}
        <Sidebar onSubmit={handleFormSubmit} isLoading={generationState.isLoading} />

        {/* Right Panel (Output) */}
        <ResultDisplay state={generationState} />
      </main>
    </div>
  );
};

export default App;
