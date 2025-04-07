const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/vocab', async (req, res) => {
  try {
    const data = req.body;
    const {
      ['x-notion-api-key']: notionApiKey,
      ['x-notion-database-id']: databaseId,
      ['x-notion-version']: notionVersion
    } = req.headers;

    if (!notionApiKey || !databaseId || !notionVersion) {
      return res.status(400).json({ error: 'Missing required Notion headers.' });
    }

    const notion = axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': notionVersion,
        'Content-Type': 'application/json'
      }
    });

    const word = data.word;

    const pageRes = await notion.post('/pages', {
      parent: { database_id: databaseId },
      properties: {
        "Vocabulary": {
          title: [{ text: { content: word } }]
        },
        "習得度": {
          status: { name: "インプット中" }
        },
        "頻出度": {
          select: { name: data["頻出度"] || "null" }
        },
        "難易度": {
          rich_text: [
            {
              type: "text",
              text: {
                content: data["難易度"] || "null"
              }
            }
          ]
        }
      }
    });

    const pageId = pageRes.data.id;

    const blocks = [
      // 🥇 頻出度 - 固定分類の表示
      calloutBlock("頻出度", data["頻出度"] || "🔺あまり使わない", "🗣"),

      // 🎓 難易度
      calloutBlock("難易度", data["難易度"] || "A1（英検5〜3級レベル）", "🎓"),

      // 📖 意味（グレー背景）
      calloutBlock("意味", data["意味"], "📖"),

      // 📜 語源（グレー背景）
      calloutBlock("語源", data["語源"], "📜"),

      // 🔗 コロケーション（青背景＋改行処理）
      calloutBlock("コロケーション", (data["collocation"] || "").split(/, ?/).join('\n'), "🔗", "blue_background"),

      // 📘 例文（青背景）
      calloutBlock("例文", data["例文"], "📘", "blue_background"),

      // 🖼 イメージ検索（黄色背景）
      data["イメージ検索"] ? calloutBlock("イメージ", `🔍 [Google画像検索でチェック](${data["イメージ検索"]})`, "🖼", "yellow_background") : null,
 
      // 🪞 類似表現（緑背景）
      calloutBlock("類似表現", data["類似表現"], "🪞", "green_background")
    ].filter(Boolean);

    // 補助関数
    function toggleBlock(title, content, color = "default") {
      return {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: title }, annotations: { bold: true, color } }],
          children: [{
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content } }]
            }
          }]
        }
      };
    }

    function calloutBlock(title, content, emoji, color = 'gray_background') {
      return {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji },
          rich_text: [{ type: 'text', text: { content } }],
          color
        }
      };
    }



    await notion.patch(`/blocks/${pageId}/children`, {
      children: blocks
    });

    res.status(200).json({ message: `✅ '${word}' added to Notion.` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to add word to Notion.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
