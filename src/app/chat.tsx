import { generate } from "@/utils/ai";
import { Chat, IMessage } from "@kesha-antonov/react-native-chat";
import { Image } from "expo-image";
import { useCallback, useState } from "react";

const appIcon = require("@/assets/images/icon.png");
export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: "AIが生成する回答には、誤りや不正確な情報が含まれる場合があります。\nAIの回答は参考情報として利用し、内容を必ずしも正しいものとして扱わないでください。",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "AI",
        avatar: () => (
          <Image source={appIcon} style={{ width: 30, height: 30 }} />
        ),
      },
    },
  ]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((previous) => Chat.append(previous, newMessages));
    const response = await generate(newMessages[0].text, true, true, true);
    const aiMessage: IMessage = {
      _id: Date.now(),
      text: response,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "AI",
        avatar: () => (
          <Image source={appIcon} style={{ width: 30, height: 30 }} />
        ),
      },
    };
    setMessages((previous) => Chat.append(previous, [aiMessage]));
  }, []);

  return (
    <>
      <Chat<IMessage>
        messages={messages}
        onSend={onSend}
        user={{ _id: 1, name: "User" }}
      />
    </>
  );
}
