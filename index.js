export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("마이코치 AI 서버 정상 작동 중입니다 🤖");
  }

  if (req.method === "POST") {
    const response = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "안녕하세요! 마이코치입니다 😊 테스트 성공!"
            }
          }
        ]
      }
    };

    return res.status(200).json(response);
  }

  return res.status(405).send("Method Not Allowed");
}
