import { useConversation } from "@11labs/react";
import React, { useCallback } from "react";
import {
  Mic,
  MicOff,
  Activity,
  Volume2,
  Volume1,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import axios from "../../utils/axiosInstance";

const Conversation = () => {
  const { theme, toggleTheme } = useTheme();

  const conversation = useConversation({
    onConnect: () =>{
      console.log("Connected")
      console.log("Convvvvv : ", conversation)
    },
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  const getSignedUrl = async () => {
    const response = await axios.get("/conversation/get-signed-url");
    return response.data.signedUrl;
  };

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl();
      
      await conversation.startSession({
        signedUrl,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
      <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {conversation.status === "connected" && (
          <div className="flex items-center gap-4">
            <motion.div
              className="w-2 h-2 rounded-full bg-blue-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="flex items-center gap-1 h-16">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 bg-blue-500 rounded-full"
                  animate={{
                    height: ["20%", "100%", "20%"],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Activity className="w-5 h-5" />
            <span className="font-medium">
              Status:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {conversation.status}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            {conversation.isSpeaking ? (
              <>
                <Volume2 className="w-5 h-5 text-green-500" />
                <span className="font-medium">Agent is speaking</span>
              </>
            ) : (
              <>
                <Volume1 className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Agent is listening</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={startConversation}
            disabled={conversation.status === "connected"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Mic className="w-5 h-5" />
            <span>Start Conversation</span>
          </button>
          <button
            onClick={stopConversation}
            disabled={conversation.status !== "connected"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <MicOff className="w-5 h-5" />
            <span>Stop Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
