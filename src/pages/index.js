import { useState, useRef, useCallback, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { openai } from "../config/openai-config";
import globalStyles from "../styles/global";

const Home = () => {
  const [content, setContent] = useState();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestingRef = useRef(false);
  const listRef = useRef();

  const scrollToBottom = useCallback(() => {
    listRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const handleClick = async () => {
    if (content || requestingRef.current) {
      try {
        setChatList((chatList) => chatList.concat({ role: "user", content }));
        setContent(null);
        setLoading(true);
        requestingRef.current = true;
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            ...chatList,
            {
              role: "user",
              content,
            },
          ],
          temperature: 0.8,
        });
        requestingRef.current = false;
        setLoading(false);
        setChatList((chatList) =>
          chatList.concat({
            role: "system",
            content: response.data.choices[0].message.content,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div style={{ margin: "16px", paddingBottom: "48px" }}>
        {chatList?.map((chat, index) => {
          return (
            <div
              key={index}
              style={{
                background: index % 2 === 0 ? "while" : "#ccc",
                padding: "8px",
                border: "1px solid #ccc",
                whiteSpace: "pre-wrap",
              }}
            >
              {chat.content}
            </div>
          );
        })}
        <div ref={listRef} />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "32px",
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
      {loading && (
        <div
          style={{
            position: "fixed",
            display: "flex",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      )}
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
};

export default Home;
