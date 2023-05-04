import { useState, useRef } from "react";
import { Button, Input } from "antd";
import { openai } from "../config/openai-config";
import globalStyles from "../styles/global";

const Home = () => {
  const [content, setContent] = useState();
  const [chatList, setChatList] = useState([]);
  const requestingRef = useRef(false);

  const handleClick = async () => {
    if (content || requestingRef.current) {
      try {
        setChatList((chatList) => chatList.concat(content));
        setContent(null);
        requestingRef.current = true;
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content,
            },
          ],
          temperature: 0,
        });
        requestingRef.current = false;
        setChatList((chatList) =>
          chatList.concat(response.data.choices[0].message.content)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div style={{ margin: "16px" }}>
        {chatList?.map((chat, index) => {
          return (
            <div
              key={index}
              style={{
                background: index % 2 === 0 ? "while" : "#ccc",
                padding: "8px",
                border: "1px solid #ccc",
              }}
            >
              {chat}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          marginBottom: "16px",
          flexDirection: "row",
          display: "flex",
        }}
      >
        <Input
          style={{ flex: 1, marginLeft: "16px" }}
          placeholder="ask chatGPT"
          onChange={(event) => {
            setContent(event.target.value);
          }}
          value={content}
        />
        <Button
          style={{ marginLeft: "8px", marginRight: "16px" }}
          onClick={handleClick}
        >
          send
        </Button>
      </div>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
};

export default Home;
