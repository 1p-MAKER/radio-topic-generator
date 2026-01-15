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
    points: string[];
}

export const generateRadioTopic = async (trends: TrendItem[]): Promise<GeneratedTopic[]> => {
    if (!trends || trends.length === 0) return [];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pick top 15 trends to avoid token limits (though flash has context)
    const trendText = trends.slice(0, 20).map(t => `- [${t.source}] ${t.title} (${t.description || ''})`).join('\n');

    const prompt = `
あなたはプロのラジオ構成作家です。
以下の現在のトレンドニュースを元に、40歳男性二人組（昭和男・奇人男）が話す面白おかしいラジオトークの話題案を3つ作成してください。
ターゲット層は30代〜50代です。彼らが共感できる、あるいは興味を惹かれる切り口でお願いします。

【キャラクター設定】
話者A: 昭和男。40歳。古風、真面目、常識人。少し頭が硬い。ツッコミ担当。「最近の若者は…」が口癖だが実は新しいものも気になる。
話者B: 奇人男。40歳。奇想天外な行動をする。ボケ担当。予想外の視点を持つ。突拍子もない理論を展開する。

【トレンド情報（これらを組み合わせて、あるいは単独で掘り下げて話題にしてください）】
${trendText}

【指示】
1. トレンドの中から、ラジオで盛り上がりそうなネタを選んでください。
2. X（旧Twitter）でバズりそうな、「意外な視点」や「共感できる愚痴」などを織り交ぜてください。
3. 二人の軽快な掛け合いが想像できるような導入を作成してください。

【出力形式】
JSON形式（Markdownのコードブロックなし）で出力してください。
配列の形式です。

[
  {
    "title": "話題のタイトル（キャッチーに）",
    "intro": "A「〜」B「〜」のような導入の会話例（2-3往復）",
    "points": ["話の展開ポイント1", "話の展開ポイント2", "オチのポイント"]
  }
]
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const topics: GeneratedTopic[] = JSON.parse(text);
        return topics;
    } catch (e) {
        console.error("Gemini generation failed", e);
        throw e;
    }
};
