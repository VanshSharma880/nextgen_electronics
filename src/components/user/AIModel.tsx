// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Send, Brain } from "lucide-react";
// import useAi from "@/features/authMutations/useAi";
// import {Spinner} from "../Spinner";

// interface ChatMessage {
//   AI: string | undefined;
//   USER: string;
// }

// const AIModel: React.FC = () => {
//   const { askAi, askAiLoading } = useAi();
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       AI: "Hey there! I'm TechBot, your AI shopping assistant. How can I help you today?",
//       USER: "",
//     },
//   ]);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const handleAskQuestion = async (form: FormData) => {
//     const input = form.get("userInput") as string;
//     if (!input) return;

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { USER: input, AI: "processing..." },
//     ]);

//     askAi(input, {
//       onSettled: (res) => {
//         setMessages((prevMessages) => {
//           const newMessages = [...prevMessages];
//           newMessages[newMessages.length - 1] = {
//             USER: input,
//             AI: res?.aiChat,
//           };
//           return newMessages;
//         });
//       },
//     });
//   };

//   // Auto-scroll to bottom when new messages appear
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <main className="flex flex-col items-center justify-between min-h-[70vh] p-4 text-gray-900 dark:text-gray-100">
//       {/* Chat Header */}
//       <div className="relative mb-4">
//         <div className="w-24 h-24 rounded-full bg-blue-500/20 animate-pulse flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-blue-500/40 animate-pulse flex items-center justify-center">
//             <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
//               <Brain className="w-4 h-4 text-white animate-bounce mt-2" />
//             </div>
//           </div>
//         </div>
//         <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping" />
//       </div>
//       {/* Chat History */}
//       <section
//         ref={chatContainerRef}
//         className="w-full max-w-2xl flex flex-col rounded-xl bg-transparent h-[50vh] overflow-y-auto shadow-lg"
//       >
//         <AnimatePresence>
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               layout
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.4, ease: "easeOut" }}
//               className="flex flex-col gap-3 mb-4"
//             >
//               {msg.USER && (
//                 <motion.div
//                   className="self-end bg-blue-500 text-white px-4 py-2 rounded-xl max-w-md shadow-md relative group"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <span>{msg.USER}</span>
//                   {/* Tail for user message */}
//                   <div className="absolute -bottom-1 right-3 w-3 h-3 bg-blue-500 rotate-45 transition-colors" />
//                 </motion.div>
//               )}
//               <motion.div
//                 className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl max-w-md shadow-md relative group"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4, delay: 0.2 }}
//               >
//                 {msg.AI === "processing..." ? (
//                   <div className="flex items-center gap-2">
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ repeat: Infinity, duration: 0.8 }}
//                       className="w-2 h-2 bg-blue-500 rounded-full"
//                     />
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{
//                         repeat: Infinity,
//                         duration: 0.8,
//                         delay: 0.2,
//                       }}
//                       className="w-2 h-2 bg-blue-500 rounded-full"
//                     />
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{
//                         repeat: Infinity,
//                         duration: 0.8,
//                         delay: 0.4,
//                       }}
//                       className="w-2 h-2 bg-blue-500 rounded-full"
//                     />
//                   </div>
//                 ) : (
//                   <span>{msg.AI}</span>
//                 )}
//                 {/* Tail for AI message */}
//                 <div className="absolute -bottom-1 left-3 w-3 h-3 bg-gray-200 dark:bg-gray-700 rotate-45 transition-colors" />
//               </motion.div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </section>

//       {/* Input Form */}
//       <section className="w-full max-w-2xl mt-6">
//         <form
//           action={handleAskQuestion}
//           className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg "
//         >
//           <input
//             name="userInput"
//             required
//             className="w-full bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm px-4 py-2 text-gray-900 dark:text-white focus:outline-none"
//             placeholder="Ask TechBot about your next gadget..."
//           />
//           <motion.button
//             disabled={askAiLoading}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full text-white disabled:opacity-50 transition flex items-center justify-center"
//             type="submit"
//           >
//             {askAiLoading ? <Spinner /> : <Send size={15} />}
//           </motion.button>
//         </form>
//       </section>
//     </main>
//   );
// };

// export default AIModel;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Brain } from "lucide-react";
import useAi from "@/features/authMutations/useAi";
import Spinner from "../Spinner";

interface ChatMessage {
  AI: string | undefined;
  USER: string;
}

// Utility to parse and format AI responses
const formatAiResponse = (aiResponse: string | undefined) => {
  if (!aiResponse || aiResponse === "processing...") {
    return aiResponse === "processing..." ? (
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
      </div>
    ) : (
      <span>Sorry, I couldn’t process that. How can I assist you?</span>
    );
  }

  // 1. Order Status Response
  const orderMatch = aiResponse.match(
    /Your latest order from (.*?) for '(.*?)' \(Qty: (\d+)\) is (.*?)\. Total: (₹[\d,]+)\. Payment: (.*?)\./
  );
  if (orderMatch) {
    const [, date, item, qty, status, total, payment] = orderMatch;
    return (
      <div className="flex flex-col gap-2">
        <p>Here’s the update on your latest order:</p>
        <ul className="list-disc list-inside text-sm">
          <li>
            <strong>Date:</strong> {date}
          </li>
          <li>
            <strong>Item:</strong> {item} (Qty: {qty})
          </li>
          <li>
            <strong>Status:</strong> {status}
          </li>
          <li>
            <strong>Total:</strong> {total}
          </li>
          <li>
            <strong>Payment:</strong> {payment}
          </li>
        </ul>
        {status.toLowerCase() === "processing" && (
          <p className="text-xs italic text-gray-600 dark:text-gray-400">
            It’s on its way soon!
          </p>
        )}
        {status.toLowerCase() === "delivered" && (
          <p className="text-xs italic text-green-600 dark:text-green-400">
            Enjoy your purchase!
          </p>
        )}
      </div>
    );
  }

  // 2. Product Recommendation Response
  const productMatch = aiResponse.match(
    /Here are a few popular options: (.*?)(Could you tell me what features.*)?$/
  );
  if (productMatch) {
    const productText = productMatch[1].trim();
    const followUp = productMatch[2];
    const products = productText
      .split(" * ")
      .filter(Boolean)
      .map((item) => {
        const [namePrice, ...rest] = item.split(". ");
        const [name, price] = namePrice.split(": ");
        const description = rest[0] || "No description available";
        const stock = rest[1]?.replace("Stock: ", "") || "N/A";
        return {
          name: name.replace(/\*\*/g, "").trim(),
          price: price?.trim() || "Price unavailable",
          description: description.trim(),
          stock: stock.trim(),
        };
      });

    return (
      <div className="flex flex-col gap-3">
        <p>
          Great! We have a wide range of Mobile & Accessories available at
          Next-Gen Electronics. Here are a few popular options:
        </p>
        <ul className="list-disc list-inside text-sm space-y-2">
          {products.map((product, index) => (
            <li key={index}>
              <strong>{product.name}:</strong> {product.price} -{" "}
              {product.description}{" "}
              <span
                className={
                  product.stock === "N/A"
                    ? "text-gray-500"
                    : parseInt(product.stock) <= 5
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                (Stock: {product.stock})
              </span>
            </li>
          ))}
        </ul>
        {followUp && <p className="text-sm">{followUp}</p>}
      </div>
    );
  }

  // 3. Generic Fallback with Basic Formatting
  const lines = aiResponse.split("\n").filter(Boolean);
  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, index) => {
        if (line.startsWith("* ")) {
          return (
            <li key={index} className="list-disc list-inside text-sm">
              {line
                .replace("* ", "")
                .split(/\*\*(.*?)\*\*/g)
                .map((part, index) =>
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )}
            </li>
          );
        }
        return (
          <p key={index} className="text-sm">
            {line
              .split(/\*\*(.*?)\*\*/g)
              .map((part, index) =>
                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
              )}
          </p>
        );
      })}
    </div>
  );
};

const AIModel: React.FC = () => {
  const { askAi, askAiLoading } = useAi();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      AI: "Hey there! I'm TechBot, your AI shopping assistant. How can I help you today?",
      USER: "",
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleAskQuestion = async (form: FormData) => {
    const input = form.get("userInput") as string;
    if (!input) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { USER: input, AI: "processing..." },
    ]);

    askAi(input, {
      onSettled: (res) => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = {
            USER: input,
            AI: res?.aiChat || "Sorry, something went wrong. Try again!",
          };
          return newMessages;
        });
      },
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col items-center justify-between min-h-[80vh] text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/40 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Brain className="w-3 h-3 text-white animate-bounce mt-1" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping" />
      </div>

      {/* Chat History */}
      <section
        ref={chatContainerRef}
        className="w-full max-w-2xl flex flex-col rounded-xl h-[60vh] overflow-y-auto shadow-lg overflow-hidden"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4 mb-4"
            >
              {msg.USER && (
                <motion.div
                  className="self-end bg-blue-500 text-white px-4 py-3 rounded-xl max-w-md shadow-md relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm">{msg.USER}</span>
                  <div className="absolute -bottom-1 right-3 w-3 h-3 bg-blue-500 rotate-45" />
                </motion.div>
              )}
              <motion.div
                className="self-start bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl max-w-md shadow-md relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {formatAiResponse(msg.AI)}
                <div className="absolute -bottom-1 left-3 w-3 h-3 bg-gray-100 dark:bg-gray-700 rotate-45" />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Input Form */}
      <section className="w-full max-w-2xl mt-4">
        <form
          action={handleAskQuestion}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg"
        >
          <input
            name="userInput"
            required
            className="w-full bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm px-4  text-gray-900 dark:text-white focus:outline-none"
            placeholder="Ask TechBot about your next gadget..."
          />
          <motion.button
            disabled={askAiLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full text-white disabled:opacity-50 transition flex items-center justify-center"
            type="submit"
          >
            {askAiLoading ? (
              <div aria-label="Loading..." role="status">
                <svg
                  className="h-4 w-4 animate-spin stroke-white"
                  viewBox="0 0 256 256"
                >
                  <line
                    x1="128"
                    y1="32"
                    x2="128"
                    y2="64"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="60.1"
                    x2="173.3"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="224"
                    y1="128"
                    x2="192"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="195.9"
                    x2="173.3"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="128"
                    y1="224"
                    x2="128"
                    y2="192"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="195.9"
                    x2="82.7"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="32"
                    y1="128"
                    x2="64"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="60.1"
                    x2="82.7"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                </svg>
              </div>
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </form>
      </section>
    </main>
  );
};

export default AIModel;
