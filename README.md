## 📘 README.md

```markdown
# 📚 Vocabulary Notion API

このプロジェクトは、英単語に関する情報（意味、語源、例文など）を Notion データベースに視覚的にわかりやすい形式で自動登録するための Node.js API です。  
iPhoneショートカット + ChatGPT と連携して使うことで、英語学習をもっと効率的に、楽しくすることができます ✨

---

## 🚀 機能概要

- ✅ 新しい英単語ページを Notion に作成
- ✅ 以下の情報を視覚的に整理されたブロックとして挿入:
  - 🗣 頻出度（固定カテゴリ）
  - 🎓 難易度（グレー背景）
  - 📖 意味（グレー背景）
  - 📜 語源（グレー背景）
  - 🔗 コロケーション（改行で並列＋青背景）
  - 📘 例文（英文＋和訳、青背景）
  - 🖼 イメージ検索リンク（黄色背景＋クリック可能なリンク）
  - 🪞 類似表現（リスト＋緑背景）

---

```

## 📦 インストール

```bash
npm install
```

---

## 🛠 起動方法

```bash
node index.js
```

サーバーは `http://localhost:3000` で起動します。

---

## 🔐 必要なリクエストヘッダー

APIにPOSTする際は、以下のヘッダーを含めてください：

| ヘッダー名                | 内容                                         |
|---------------------------|----------------------------------------------|
| `x-notion-api-key`        | Notionの統合トークン（`secret_...`）         |
| `x-notion-database-id`    | 登録先のデータベースID（UUID）              |
| `x-notion-version`        | Notion APIのバージョン（例：`2022-06-28`） |

---

## 📝 POSTリクエストの例

```bash
curl -X POST http://localhost:3000/api/vocab \
  -H "Content-Type: application/json" \
  -H "x-notion-api-key: secret_...your_key..." \
  -H "x-notion-database-id: your_database_id" \
  -H "x-notion-version: 2022-06-28" \
  -d '{
    "word": "punctual",
    "頻出度": "🥈超使える",
    "難易度": "B1（英検準2〜2級レベル）",
    "意味": "時間を守る、時間に正確な",
    "語源": "ラテン語 punctum（点）に由来し、時間の「正確さ」を示す意味が転じた",
    "collocation": "punctual + person\npunctual + arrival\npunctual + employee",
    "例文": "She is always punctual for meetings.\n彼女はいつも会議に時間通りに来ます。\n\nPlease be punctual for your job interview.\n就職面接には時間を守ってください。",
    "イメージ検索": "https://www.google.com/search?tbm=isch&q=punctual",
    "類似表現": "■on time（時間通り）: punctual のより一般的な表現\n■prompt（即座の）: 素早く行動する意味\n■timely（適時の）: 状況に合ったタイミング"
  }'
```

---

## 🧠 推奨されるChatGPTプロンプト（iPhone用）

```
以下の英単語について、以下の項目に従って回答し、最後にJSONで出力してください：{word}
■ 頻出度:  
次の4分類から1つ選び、その理由も記述（出力形式は固定）  
- 🥇目から鱗  
- 🥈超使える  
- 🥉使える  
- 🔺あまり使わない

■ 難易度:  
A1〜C2表記 + 日本語補足（例：A2（英検3〜準2級））

■ 意味:  
1〜2文で簡潔な日本語訳

■ 語源:  
ラテン語や語根の説明、由来など

■ collocation:  
語彙 + 一緒に使われる語を5個、カンマで区切らず改行で出力（例：obey + the law\nobey + orders...）

■ 例文:  
英文3文 + 日本語訳3文（ペアで改行して）

■ イメージ検索リンク:  
https://www.google.com/search?tbm=isch&q=[単語]

■ 類似表現:  
■[単語]（日本語訳）＋補足説明（3つ以上）

---

出力例:

{
  "word": "punctual",
  "頻出度": "🥈超使える",
  "難易度": "B1（英検準2〜2級レベル）",
  "意味": "時間を守る、時間に正確な",
  "語源": "ラテン語 punctum（点）に由来し、時間の「正確さ」を示す意味が転じた",
  "collocation": "punctual + person\npunctual + arrival\npunctual + employee\npunctual + bus\nbe punctual",
  "例文": "She is always punctual for meetings.\n彼女はいつも会議に時間通りに来ます。\n\nPlease be punctual for your job interview.\n就職面接には時間を守ってください。\n\nTrains in Japan are known for being punctual.\n日本の電車は時間に正確で知られています。",
  "イメージ検索": "https://www.google.com/search?tbm=isch&q=punctual",
  "類似表現": "■on time（時間通りに）: punctual のより一般的な表現\n■prompt（即座の）: 素早く行動するという意味合いもある\n■timely（適時の）: 状況に合った時間的タイミング"
}
```

---
