import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LessonFormData } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateLessonPlan = async (data: LessonFormData): Promise<string> => {
  try {
    const parts: any[] = [];

    // Construct the text prompt
    let prompt = `Hãy soạn giáo án cho môn học: ${data.subject}, ${data.grade}, Bộ sách: ${data.bookSet}.\n`;
    prompt += `Tên bài học: "${data.lessonName}".\n`;
    prompt += `Thời lượng: ${data.periods} tiết.\n`;
    prompt += `Hãy chi tiết hoá các hoạt động của giáo viên và học sinh. Đừng quên tích hợp năng lực số.`;

    // Handle image if present
    if (data.image) {
      const imagePart = await fileToGenerativePart(data.image);
      parts.push(imagePart);
      prompt += `\n(Lưu ý: Sử dụng nội dung từ tài liệu đính kèm (Ảnh/PDF SGK) để soạn nội dung chi tiết cho các hoạt động).`;
    }

    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    
    // Explicitly check for text property as per SDK documentation
    if (response.text) {
        return response.text;
    }
    
    // Fallback if text is empty but candidates exist (rare)
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
         const parts = response.candidates[0].content.parts;
         const textParts = parts.map((p: any) => p.text).join('');
         if (textParts) return textParts;
    }

    return "Không tạo được nội dung. Vui lòng thử lại.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.");
  }
};