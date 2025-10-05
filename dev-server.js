const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const vocabHandler = require('./api/vocab');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(express.json());

// Swagger設定
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notion Vocabulary API',
      version: '1.0.0',
      description: 'Notionデータベースに単語を追加するAPI',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '開発サーバー',
      },
    ],
  },
  apis: ['./dev-server.js'], // このファイル内のJSDocコメントを読み込み
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /api/vocab:
 *   post:
 *     summary: Notionデータベースに単語を追加
 *     description: 指定された単語とその詳細情報をNotionデータベースに追加します
 *     tags: [Vocabulary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - word
 *             properties:
 *               word:
 *                 type: string
 *                 description: 追加する単語
 *                 example: "hello"
 *               頻出度:
 *                 type: string
 *                 description: 単語の頻出度
 *                 example: "🔺あまり使わない"
 *               難易度:
 *                 type: string
 *                 description: 単語の難易度レベル
 *                 example: "A1"
 *               意味:
 *                 type: string
 *                 description: 単語の意味
 *                 example: "こんにちは"
 *               語源:
 *                 type: string
 *                 description: 単語の語源
 *                 example: "古英語のhælan"
 *               collocation:
 *                 type: string
 *                 description: コロケーション（カンマ区切り）
 *                 example: "hello world, say hello"
 *               例文:
 *                 type: string
 *                 description: 例文
 *                 example: "Hello, how are you?"
 *               イメージ検索:
 *                 type: string
 *                 description: イメージ検索のURL
 *                 example: "https://www.google.com/search?q=hello"
 *               類似表現:
 *                 type: string
 *                 description: 類似表現
 *                 example: "hi, hey"
 *     headers:
 *       x-notion-api-key:
 *         required: true
 *         schema:
 *           type: string
 *         description: Notion APIキー
 *       x-notion-database-id:
 *         required: true
 *         schema:
 *           type: string
 *         description: NotionデータベースID
 *       x-notion-version:
 *         required: true
 *         schema:
 *           type: string
 *         description: Notion APIバージョン
 *     responses:
 *       200:
 *         description: 単語が正常に追加されました
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ 'hello' added to Notion."
 *       400:
 *         description: リクエストが不正です
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required Notion headers."
 *       405:
 *         description: メソッドが許可されていません
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Method Not Allowed"
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add word to Notion."
 */
app.post('/api/vocab', vocabHandler);

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({
    message: 'Notion Vocabulary API',
    documentation: '/api-docs',
    endpoints: {
      'POST /api/vocab': 'Add word to Notion database'
    }
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Development server started: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
});
