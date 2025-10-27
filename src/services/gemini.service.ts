import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile } from '../models/user.model';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null;
  private languageService = inject(LanguageService);

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error("API_KEY environment variable not set.");
      this.ai = null;
    }
  }

  async generateAdvice(profile: UserProfile): Promise<string[]> {
    if (!this.ai) {
      console.error('GeminiService not initialized. No API Key.');
      return ["There was an issue getting your personalized advice. Please check your API key configuration."];
    }

    const { age, gender, goal } = profile;
    const language = this.languageService.language() === 'es' ? 'Spanish' : 'English';
    const prompt = this.languageService.translate('prompts.advice', { age, gender, goal, language });

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text.trim();
      // Split by newline and filter out any empty lines.
      // Then remove the numbering like "1. ", "2. " etc.
      return text.split('\n').filter(line => line.length > 0).map(line => line.replace(/^\d+\.\s*/, ''));
    } catch (error) {
      console.error('Error generating advice from Gemini API:', error);
      throw error;
    }
  }

  async analyzeSelfie(profile: UserProfile, imageBase64: string): Promise<{ score: number; selfAssessment: string; recommendations: string[] }> {
    if (!this.ai) {
      console.error('GeminiService not initialized. No API Key.');
      return {
        score: 50,
        selfAssessment: "Could not analyze selfie. The application is missing the required API Key.",
        recommendations: ["Please contact the administrator to configure the service correctly."]
      };
    }

    const { age, gender, goal } = profile;
    const language = this.languageService.language() === 'es' ? 'Spanish' : 'English';
    const prompt = this.languageService.translate('prompts.selfieAnalysis', { age, gender, goal, language });

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    };

    const textPart = {
      text: prompt
    };
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: {
                type: Type.NUMBER,
                description: "A score from 0 to 100 based on the analysis."
              },
              selfAssessment: {
                type: Type.STRING,
                description: "A brief self-assessment of the current state."
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of actionable recommendations for improvement."
              }
            },
            propertyOrdering: ["score", "selfAssessment", "recommendations"]
          }
        }
      });

      const jsonString = response.text.trim();
      const result = JSON.parse(jsonString);
      
      if (typeof result.score === 'number' && typeof result.selfAssessment === 'string' && Array.isArray(result.recommendations)) {
        return {
          score: Math.round(result.score),
          selfAssessment: result.selfAssessment,
          recommendations: result.recommendations,
        };
      } else {
        throw new Error("Invalid JSON structure from Gemini API");
      }

    } catch (error) {
      console.error('Error analyzing selfie with Gemini API:', error);
      return {
        score: 50,
        selfAssessment: "Sorry, I couldn't analyze your selfie. The AI model might be unavailable or encountered an error.",
        recommendations: ["Please try again later."]
      };
    }
  }
}