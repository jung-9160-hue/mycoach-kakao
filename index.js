export default async function handler(req, res) {

  // 카카오 스킬 테스트 및 GET 접속 확인
  if (req.method === "GET") {
    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "마이코치 AI 서버가 정상 작동 중입니다 🤖"
            }
          }
        ]
      }
    });
  }

  // POST 이외의 요청도 오류 대신 정상 응답
  if (req.method !== "POST") {
    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "마이코치 AI 서버 연결 완료 🤖"
            }
          }
        ]
      }
    });
  }

  try {
    // 카카오톡 사용자 메시지 가져오기
    const userMessage =
      req.body?.userRequest?.utterance || "안녕하세요";

    // OpenAI 호출
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6",
          messages: [
            {
              role: "system",
              content:
                "너는 마이코치라는 친절한 AI 다이어트 코치다. 사용자의 식단, 운동, 체중 관리 질문에 친절하고 현실적으로 답변해줘."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    const aiMessage =
      data?.choices?.[0]?.message?.content ||
      "죄송해요 😥 답변을 가져오지 못했어요.";

    // 카카오톡으로 응답
    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: aiMessage
            }
          }
        ]
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "죄송해요 😥 잠시 문제가 발생했어요. 다시 질문해주세요."
            }
          }
        ]
      }
    });
  }
}
