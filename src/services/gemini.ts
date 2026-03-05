import { GoogleGenAI, Type } from "@google/genai";
import { ChartType, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeData = async (dataSample: any[], columns: any[]) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following data sample and columns. 
    Suggest 4-6 key charts and KPIs for a professional dashboard.
    
    Data Sample (first 5 rows): ${JSON.stringify(dataSample)}
    Columns: ${JSON.stringify(columns)}

    Return a JSON object with:
    1. "suggestedCharts": array of objects with { type, title, xAxis, yAxis, aggregation }
    2. "insights": array of objects with { title, content, type }
    3. "summary": a brief overview of the data.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedCharts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "One of: kpi, bar, line, area, pie, donut, scatter" },
                title: { type: Type.STRING },
                xAxis: { type: Type.STRING },
                yAxis: { type: Type.STRING },
                aggregation: { type: Type.STRING, description: "One of: sum, avg, count" }
              }
            }
          },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING, description: "One of: positive, negative, neutral, warning" }
              }
            }
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const chatWithData = async (query: string, dataSummary: string, history: any[]) => {
  const model = "gemini-3.1-pro-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are a data analyst assistant for DataDash AI. 
      You help users understand their data. 
      Data Summary: ${dataSummary}. 
      Be concise, professional, and insightful.`
    }
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
};

export const analyzeDashboardScreenshot = async (base64Image: string) => {
  const model = "gemini-2.5-flash-image";
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: "image/png" } },
        { text: "Analyze this dashboard design and suggest a similar layout and chart types for our dashboard maker." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedLayout: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                position: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
