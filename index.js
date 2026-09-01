export default function handler(req, res) {
  return res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "마이코치 AI 연결 성공! 🤖"
          }
        }
      ]
    }
  });
}
