import { useState } from "react";
import type { RequestDetails } from "deep-chat";
import { DeepChat } from "deep-chat-react";
import { Box, Button } from "@mui/material";
import Fab from "@mui/material/Fab";
import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useRef } from "react";

export default function Deepseeker() {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.htmlClassUtilities = {
      ["quick-question"]: {
        events: {
          click: (event: any) => {
            const text = event.target.innerText;
            chatRef.current.submitUserMessage(text);
          },
        },
        styles: {
          default: {
            backgroundColor: "#f2f2f2",
            borderRadius: "16px",
            padding: "8px 12px",
            cursor: "pointer",
            textAlign: "center",
            fontSize: "14px",
            marginTop: "6px",
          },
          hover: { backgroundColor: "#eaeaea" },
          click: { backgroundColor: "#dedede" },
        },
      },
    };
  }, [isOpen]);
  return (
    <>
      <Fab
        variant="extended"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 70,
          zIndex: 1100,
        }}
      >
        <ChatIcon sx={{ mr: 1 }} />
        {isOpen ? "Close Chat" : "Open Chat"}
      </Fab>

      {/* Chat Box */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 70,
            width: 400,
            zIndex: 1000,
          }}
        >
          <DeepChat
            ref={chatRef}
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "400px",
            }}
            introMessage={[
              //   text: "Chào mừng bạn đến với The Shate shop! \nThe Shate cung cấp các sản phẩm giày chất lượng cao, phù hợp cho nhiều phong cách và nhu cầu khác nhau.\nHãy hỏi mình về thông tin sản phẩm, size, giá bán, ưu đãi hoặc hỗ trợ đặt hàng nhé.",
              {
                // role: "assistant",
                text:
                  "Chào mừng bạn đến với The Shate shop 👟\n" +
                  "Bạn có thể chọn nhanh một câu hỏi bên dưới 👇",
              },
              {
                // role: "assistant",
                html: `
                  <div>
                    <div class="quick-question">Shop có mẫu sneaker nào bán chạy?</div>
                    <div class="quick-question">Có giày size 42 không?</div>
                    <div class="quick-question">Shop đang có khuyến mãi gì?</div>
                    <div class="quick-question">Thời gian giao hàng bao lâu?</div>
                  </div>
                `,
              },
            ]}
            connect={{ url: "http://localhost:8001/rag/invoke" }}
            requestBodyLimits={{ maxMessages: -1 }}
            requestInterceptor={(details: RequestDetails) => {
              const messages = details.body?.messages || [];

              const userMessage =
                messages.length > 0 ? messages[messages.length - 1]?.text : "";

              return {
                ...details,
                body: {
                  input: {
                    question: userMessage,
                  },
                },
              };
            }}
            responseInterceptor={(response: any) => {
              return {
                text:
                  response?.output?.generation ?? "No response from server.",
              };
            }}
          />
        </Box>
      )}
    </>
  );
}
