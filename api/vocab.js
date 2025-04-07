const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

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
          select: { name: data["頻出度"] || "🔺あまり使わない" }
        },
        "難易度": {
          rich_text: [{
            type: "text",
            text: { content: data["難易度"] || "A1" }
          }]
        }
      }
    });

    const pageId = pageRes.data.id;

    const blocks = [
      callout("頻出度", data["頻出度"] || "🔺あまり使わない", "🗣"),
      callout("難易度", data["難易度"] || "A1", "🎓"),
      callout("意味", data["意味"], "📖"),
      callout("語源", data["語源"], "📜"),
      callout("コロケーション", (data["collocation"] || "").split(/, ?/).join("\n"), "🔗", "blue_background"),
      callout("例文", data["例文"], "📘", "blue_background"),
      data["イメージ検索"]
        ? calloutWithLink("イメージ", "🔍 Google画像検索でチェック", data["イメージ検索"], "🖼", "yellow_background")
        : null,
      callout("類似表現", data["類似表現"], "🪞", "green_background")
    ].filter(Boolean);

    function callout(title, content, emoji, color = "gray_background") {
      return {
        object: "block",
        type: "callout",
        callout: {
          icon: { type: "emoji", emoji },
          rich_text: [{ type: "text", text: { content } }],
          color
        }
      };
    }

    function calloutWithLink(title, text, url, emoji, color = "gray_background") {
      return {
        object: "block",
        type: "callout",
        callout: {
          icon: { type: "emoji", emoji },
          rich_text: [{
            type: "text",
            text: {
              content: text,
              link: { url }
            }
          }],
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
};
