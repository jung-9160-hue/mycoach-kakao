export default async function handler(req, res) {
  // 카카오에서 POST 요청이 아닌 방식으로 접속했을 때
  if (req.method === "GET") {
    return res.status(200).send("마이코치 AI 서버가 정상 작동 중입니다 🤖");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // 카카오톡에서 보낸 사용자 메시지 가져오기
    const userMessage =
      req.body?.userRequest?.utterance || "안녕하세요";

    // OpenAI API 호출
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5.6",
          messages: [
            {
              role: "system",
              content: `
너는 "마이코치"라는 친절한 AI 다이어트 코치다.

사용자의 다이어트, 식단, 운동에 대해 친절하고 쉽게 답변한다.
무조건 짧고 이해하기 쉽게 답변한다.
의학적 진단은 하지 않는다.
위험한 다이어트 방법은 추천하지 않는다.
사용자의 목표를 응원하는 말투를 사용한다.
              `,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await openaiResponse.json();

    // OpenAI 오류 확인
    if (!openaiResponse.ok) {
      console.error(data);

      throw new Error(
        data?.error?.message || "OpenAI API 오류"
      );
    }

    // AI 답변 가져오기
    const aiMessage =
      data.choices?.[0]?.message?.content ||
      "죄송해요. 다시 한번 질문해주세요 😊";

    // 카카오톡 챗봇 형식으로 응답
    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: aiMessage,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "죄송해요 😢 잠시 문제가 발생했어요. 다시 질문해주세요!",
            },
          },
        ],
      },
    });
  }
}
