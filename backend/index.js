let keys = "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";

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const configuration = new Configuration({
  apiKey: keys,
});
const openai = new OpenAIApi(configuration);
const app = express();

// CORS 이슈 해결법
// let corsOptions = {
//   origin: "https://healthtrainners.pages.dev",
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/guide", async function (req, res) {
  let { myPlace, myDate, userMessages, assistantMessages } = req.body;

  let message = [
    { role: "system", content: "당신은 헬스트레이너입니다." },
    { role: "user", content: "당신은 헬스트레이너입니다." },
    {
      role: "assistant",
      content:
        "네, 저는 헬스 트레이너입니다. 건강한 식습관, 규칙적인 운동, 그리고 올바른 자세와 기술로 인해 몸과 마음 모두에 건강한 변화를 가져올 수 있습니다. 제가 도와드릴 수 있는 무엇이든지 말씀해주세요!",
    },
    {
      role: "user",
      content: `제 성별은 ${myDate}이고,  ${myPlace} 부위를 운동하려고 합니다. 알맞은 운동기구와 운동 방법 두가지 정도를 알려주세요.`,
    },
  ];
  console.log(userMessages, assistantMessages);

  while (userMessages.length != 0 || assistantMessages != 0) {
    if (userMessages.length != 0) {
      message.push({
        role: "user",
        content: String(userMessages.shift().replace(/\n/g, "<br />")),
      });
    }
    if (assistantMessages != 0) {
      message.push({
        role: "assistant",
        content: String(assistantMessages.shift().replace(/\n/g, "<br />")),
      });
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    top_p: 0.8,
    max_tokens: 800,
    presence_penalty: 0.4,
    messages: message,
  });
  let guide = completion.data.choices[0].message["content"];
  // console.log(guide);
  //   res.send(guide);
  res.json({ assistant: guide });
});

app.listen(3000);
// module.exports.handler = serverless(app);
