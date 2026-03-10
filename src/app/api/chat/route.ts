import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let profileData = {};
try {
  const profilePath = path.join(process.cwd(), 'data', 'profile.json');
  profileData = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
} catch (e) {
  console.error('Failed to load profile data', e);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // We only take the last message for this simple representation,
    // but in a real app we might pass the full history.
    const latestMessage = messages[messages.length - 1].content;

    const systemInstruction = `Tu es le double numérique (AI Double) de Mael Jerome, un ingénieur Fullstack Senior.
Tu réponds aux questions sur le parcours, l'expérience et les projets de Mael en utilisant les informations fournies ci-dessous.
Si une compétence ou un sujet n'est pas mentionné (par exemple Docker), indique que ce n'est pas listé dans ses expériences actuelles, mais que Mael est un développeur complet et apprend rapidement de nouvelles technologies.
Réponds en français, sois concis, professionnel et amical.

--- Informations du Profil de Mael Jerome ---
${JSON.stringify(profileData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: latestMessage,
      config: {
        systemInstruction,
      }
    });

    return NextResponse.json({ role: 'assistant', content: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: `Erreur technique: ${error.message || error}` }, { status: 500 });
  }
}
