import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TrendItem } from "./newsFetcher";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fallback if key is missing (should not happen based on user input, but good for safety)
if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set!");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export interface GeneratedTopic {
  title: string;
  intro: string;
  essence: string;
  bPerspective: string;
  refLink?: string;
}

export const generateRadioTopic = async (trends: TrendItem[]): Promise<GeneratedTopic[]> => {
  if (!trends || trends.length === 0) return [];

  // Updated to gemini-1.5-flash-latest for better compatibility
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // Pick top 15 trends to avoid token limits (though flash has context)
  const trendText = trends.slice(0, 20).map(t => `- [${t.source}] ${t.title} (${t.description || ''})`).join('\n');

  const prompt = `
あなたはプロのラジオ構成作家です。
以下の「ユーザーが選択したトレンドニュース」について、それぞれの**概要**と、それをネタにした40歳男性（奇人男）の**面白い持論**を作成してください。

ターゲット層は30代〜50代。
**二人は同級生の設定なので、敬語は禁止です。完全にタメ口で話してください。**

【キャラクター設定】
話者B: 奇人男。40歳。奇想天外な発想を持つ天才肌。独自の理論や偏見を一方的にまくし立てます。

【ユーザーが選んだトレンド】
${trendText}

【指示】
1. **入力されたトレンドの数だけ、必ず個別にJSONオブジェクトを作成してください。（3つ入力があれば3つ出力）**
2. 各トレンドについて、以下の4点を作成してください。
   - **概要**: そのニュースがどんな内容か、端的に分かりやすく説明（常識的なトーンでOK）。
   - **ニュースの本質**: このニュースは何が重要なのか、あるいは何が面白いのか、**一般的な視点で一言で**言い切ってください。（「〜という社会現象だ」「〜がついに実現した形だ」など）
   - **奇人男の持論**: そのニュースに対するBの独自の視点、偏見、ボケ。（**一言だけでOK。タメ口で**）

【出力形式】
JSON形式（Markdownのコードブロックなし）で、以下の配列を出力してください。

[
  {
    "title": "元ニュースのタイトル",
    "intro": "ニュースの概要（2〜3行で簡潔に）",
    "essence": "ニュースの本質（一般的な視点で一言）",
    "bPerspective": "奇人男の持論（タメ口で一言だけ）"
  },
  ...
]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const rawTopics: GeneratedTopic[] = JSON.parse(text);

    // Merge original links
    // Assuming 1:1 mapping based on order. The Prompt mandates 1 object per input.
    const topics = rawTopics.map((topic, index) => ({
      ...topic,
      refLink: trends[index]?.link
    }));

    return topics;
  } catch (e) {
    console.error("Gemini generation failed", e);
    throw e;
  }
};
