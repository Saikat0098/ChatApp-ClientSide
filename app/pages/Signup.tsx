import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  User,
  Mail,
  Lock,
  CheckCircle,
  Sparkles,
  Shield,
  Globe,
  AlertCircle,
} from "lucide-react";
import { axiosInstance } from "~/Hooks/useAxiosPublic";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router";
export default function ChatSignup() {
  // Zustand store for authentication
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Welcome to NebulaChat! To begin your journey, please share your full name.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("cosmic"); // cosmic, aurora, nebula
  const [isMobile, setIsMobile] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field when step changes
  useEffect(() => {
    if (!isComplete) {
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  }, [step, isComplete]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Get icon for current input step
  const getStepIcon = () => {
    switch (step) {
      case 0:
        return <User className="w-5 h-5 text-indigo-400" />;
      case 1:
        return <Mail className="w-5 h-5 text-indigo-400" />;
      case 2:
        return <Lock className="w-5 h-5 text-indigo-400" />;
      default:
        return null;
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 0:
        return "Your full name";
      case 1:
        return "Your email address";
      case 2:
        return "Create a password";
      default:
        return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message with typing animation
    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];

    // Process current step
    if (step === 0) {
      // Save full name
      setUserData({ ...userData, fullName: input });

      // Simulate bot typing with delay
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            text: `Nice to meet you, ${input}! Now, let's get your email address to secure your account.`,
            sender: "bot",
            icon: <Mail className="w-4 h-4" />,
          },
        ]);
      }, 800);

      setStep(1);
    } else if (step === 1) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setTimeout(() => {
          setMessages([
            ...newMessages,
            {
              text: "Hmm, that doesn't look like a valid email. Could you double-check and try again?",
              sender: "bot",
              error: true,
            },
          ]);
        }, 600);
        setMessages(newMessages);
        setInput("");
        return;
      }

      // Save email
      setUserData({ ...userData, email: input });

      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            text: "Perfect! Finally, create a secure password to protect your account.",
            sender: "bot",
            icon: <Lock className="w-4 h-4" />,
          },
        ]);
      }, 800);

      setStep(2);
    } else if (step === 2) {
      // Password validation
      if (input.length < 6) {
        setTimeout(() => {
          setMessages([
            ...newMessages,
            {
              text: "For better security, your password should be at least 6 characters. Please try again.",
              sender: "bot",
              error: true,
            },
          ]);
        }, 600);
        setMessages(newMessages);
        setInput("");
        return;
      }

      // Save password
      setUserData({ ...userData, password: input });

      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            text: "Great! Your profile is ready. Click 'Launch Account' to begin your journey.",
            sender: "bot",
            icon: <CheckCircle className="w-4 h-4" />,
          },
        ]);
        setIsComplete(true);
      }, 800);
    }

    // Immediately update with user's message
    setMessages(newMessages);
    setInput("");
  };

  const handleRegistration = async () => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setError(null);

    try {
      // Send user data to backend
      const response = await axiosInstance.post("auth/api/signup", userData);
      console.log("Registration response:", response.data);

      // Check for existing user error in the response
      if (
        response.data &&
        ((response.data.response &&
          response.data.response.data === "User already exists") ||
          response.data.message === "Email already exist")
      ) {
        setError("Email already exists");

        setMessages([
          ...messages,
          {
            text: `It looks like this email is already registered with NebulaChat. Would you like to try logging in instead?`,
            sender: "bot",
            error: true,
            icon: <AlertCircle className="w-4 h-4" />,
          },
        ]);
        return;
      }

      // Check if registration was successful - checking for 'success' property or status code
      if (
        (response.data && response.data.success) ||
        response.status === 201 ||
        response.status === 200
      ) {
        setIsRegistered(true);

        // Update auth store with user data
        const userData = response.data.user || response.data;
        useAuthStore.getState().setRegisteredUser(userData);

        setTimeout(() => {
          setMessages([
            ...messages,
            {
              text: `✨ Welcome aboard, ${userData.fullName}! Your NebulaChat universe awaits.`,
              sender: "bot",
              success: true,
            },
          ]);
        }, 3000);
        navigate("/");
        return;
      }

      // If we reach here, throw a generic error
      throw new Error("Registration failed. Please try again.");
    } catch (error) {
      console.error("Error registering user:", error);

      // Check if it's a "user already exists" error
      if (error.response && error.response.data) {
        if (
          error.response.data.message === "Email already exist" ||
          (error.response.data.response &&
            error.response.data.response.data === "User already exists")
        ) {
          setError("Email already exists");
          setMessages([
            ...messages,
            {
              text: `It looks like this email is already registered with NebulaChat. Would you like to try logging in instead?`,
              sender: "bot",
              error: true,
              icon: <AlertCircle className="w-4 h-4" />,
            },
          ]);
          return;
        }
      }

      // Generic error handling
      let errorMessage =
        "Something went wrong with registration. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setMessages([
        ...messages,
        {
          text: errorMessage,
          sender: "bot",
          error: true,
          icon: <AlertCircle className="w-4 h-4" />,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const themeStyles = {
    cosmic: {
      bg: "bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900",
      accent: "from-violet-500 to-fuchsia-500",
      button: "from-fuchsia-600 to-violet-600",
      chatBg: "from-gray-900 to-indigo-950",
      card: "bg-gray-900 bg-opacity-40",
      inputBg: "bg-gray-800",
      text: "text-white",
      secondaryText: "text-indigo-200",
      messageBg: "from-fuchsia-600 to-violet-600",
      botMessageBg: "bg-gray-800",
      particles: "#ffffff",
    },
    aurora: {
      bg: "bg-gradient-to-br from-teal-900 via-emerald-800 to-green-900",
      accent: "from-emerald-400 to-teal-500",
      button: "from-teal-600 to-emerald-600",
      chatBg: "from-gray-900 to-green-950",
      card: "bg-gray-900 bg-opacity-40",
      inputBg: "bg-gray-800",
      text: "text-white",
      secondaryText: "text-emerald-200",
      messageBg: "from-emerald-600 to-teal-600",
      botMessageBg: "bg-gray-800",
      particles: "#c2f7e1",
    },
    nebula: {
      bg: "bg-gradient-to-br from-pink-900 via-rose-800 to-red-900",
      accent: "from-amber-500 to-rose-500",
      button: "from-rose-600 to-amber-600",
      chatBg: "from-gray-900 to-rose-950",
      card: "bg-gray-900 bg-opacity-40",
      inputBg: "bg-gray-800",
      text: "text-white",
      secondaryText: "text-rose-200",
      messageBg: "from-rose-600 to-amber-600",
      botMessageBg: "bg-gray-800",
      particles: "#ffd6d6",
    },
  };

  const activeTheme = themeStyles[theme];

  // Render login button if email already exists
  const renderActionButton = () => {
    if (error === "Email already exists") {
      return (
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => (window.location.href = "/login")}
            className={`w-full bg-gradient-to-r ${activeTheme.button} hover:opacity-90 text-white font-bold py-4 lg:py-5 px-4 lg:px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center backdrop-blur-sm text-sm lg:text-base`}
          >
            Log In Instead
          </button>
          <button
            onClick={() => {
              setError(null);
              setStep(1); // Go back to email step
              setIsComplete(false);
              setMessages([
                ...messages.slice(0, -1),
                {
                  text: "Let's try a different email address.",
                  sender: "bot",
                  icon: <Mail className="w-4 h-4" />,
                },
              ]);
            }}
            className={`w-full border border-white border-opacity-20 bg-transparent hover:bg-white hover:bg-opacity-10 text-white font-bold py-4 lg:py-5 px-4 lg:px-6 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm lg:text-base`}
          >
            Try Different Email
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleRegistration}
        disabled={isRegistered || isLoading}
        className={`w-full ${
          isRegistered
            ? "bg-emerald-600 cursor-default"
            : isLoading
            ? `bg-gray-600 cursor-wait`
            : `bg-gradient-to-r ${activeTheme.button} hover:opacity-90`
        } text-white font-bold py-4 lg:py-5 px-4 lg:px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center backdrop-blur-sm text-sm lg:text-base`}
      >
        {isRegistered ? (
          <>
            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Journey Begun
          </>
        ) : isLoading ? (
          <>
            <div className="w-4 h-4 lg:w-5 lg:h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Launch Account
          </>
        )}
      </button>
    );
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen ${activeTheme.bg}`}>
      {/* Floating objects in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 blur-sm"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle at center, ${activeTheme.particles}, transparent)`,
              animation: `float ${
                Math.random() * 20 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Brand Section with 3D-like elements */}
      <div className="w-full lg:w-96 flex flex-col items-center justify-center relative overflow-hidden p-4 lg:p-8">
        {/* 3D-like logo */}
        <div className="relative z-10 mb-4 lg:mb-8 perspective">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br bg-black flex items-center justify-center transform rotate-12 -translate-x-1 -translate-y-1 shadow-lg">
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-inner">
              <div
                className={`w-16 h-16 lg:w-24 lg:h-24 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center shadow-lg`}
              >
                <Sparkles className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div></div>

        {/* App name with enhanced typography */}
        <h1
          className={`${activeTheme.text} text-3xl lg:text-4xl font-bold mb-2 lg:mb-3 relative z-10 tracking-tight`}
        >
          <span className="inline-block transform -rotate-3">Nebula</span>
          <span className="inline-block">Chat</span>
        </h1>
        <p
          className={`${activeTheme.secondaryText} text-center px-6 lg:px-10 relative z-10 font-light text-sm lg:text-base`}
        >
          Explore conversations across the digital cosmos
        </p>

        {/* Theme selector */}
        <div className="mt-4 lg:mt-8 flex justify-center gap-3 relative z-10">
          <button
            onClick={() => setTheme("cosmic")}
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ${
              theme === "cosmic" ? "ring-2 ring-white" : ""
            }`}
          />
          <button
            onClick={() => setTheme("aurora")}
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 ${
              theme === "aurora" ? "ring-2 ring-white" : ""
            }`}
          />
          <button
            onClick={() => setTheme("nebula")}
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 ${
              theme === "nebula" ? "ring-2 ring-white" : ""
            }`}
          />
        </div>

        {/* login  */}
        <div className="mt-4 lg:mt-8 flex flex-col items-center gap-2 relative z-10">
          <Link
            to="/login"
            className="group text-sm lg:text-base font-semibold px-6 py-2 rounded-xl 
               backdrop-blur-md bg-white/10 text-white ring-1 ring-white/20 shadow-[0_0_15px_#ff5e6c55]
               hover:shadow-[0_0_25px_#ff5e6cAA] hover:ring-[#FF5E6C] hover:bg-white/20 
               transition duration-300 ease-in-out tracking-wide"
          >
            <span className="inline-block text-xs group-hover:translate-y-[-1px] transition-transform duration-300">
              Already have an account?{" "}
              <span className="text-[#FF5E6C] underline">Log in</span>
            </span>
          </Link>
        </div>

        {/* Feature badges with icons - hidden on small screens */}
        <div className="mt-6 lg:mt-12 grid grid-cols-2 gap-2 lg:gap-4 px-4 lg:px-8 relative z-10 w-full">
          <div
            className={`${activeTheme.card} backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white border-opacity-10`}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center`}
              >
                <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className={`${activeTheme.text} text-xs lg:text-sm`}>
                Cosmic Messages
              </span>
            </div>
          </div>
          <div
            className={`${activeTheme.card} backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white border-opacity-10`}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center`}
              >
                <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className={`${activeTheme.text} text-xs lg:text-sm`}>
                Universal Calls
              </span>
            </div>
          </div>
          <div
            className={`${activeTheme.card} backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white border-opacity-10`}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center`}
              >
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className={`${activeTheme.text} text-xs lg:text-sm`}>
                Quantum Security
              </span>
            </div>
          </div>
          <div
            className={`${activeTheme.card} backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white border-opacity-10`}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center`}
              >
                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className={`${activeTheme.text} text-xs lg:text-sm`}>
                Stellar Effects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section with glass morphism */}
      <div className="flex-1 flex flex-col mx-3 my-3 lg:mx-6 lg:my-6 rounded-2xl overflow-hidden backdrop-blur-xl border border-white border-opacity-10 shadow-2xl">
        <div
          className={`bg-gradient-to-r ${activeTheme.accent} p-4 lg:p-6 ${activeTheme.text}`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center border border-white border-opacity-20">
              <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="ml-3 lg:ml-4">
              <h2 className="text-xl lg:text-2xl font-bold">
                Create Your Space
              </h2>
              <p className={`${activeTheme.secondaryText} text-xs lg:text-sm`}>
                Your cosmic journey begins with a chat
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className={`flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-b ${activeTheme.chatBg}`}
        >
          <div className="space-y-4 lg:space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } items-end`}
              >
                {message.sender === "bot" && (
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br ${activeTheme.accent} flex items-center justify-center mr-2 lg:mr-3 shadow-lg`}
                  >
                    {message.icon || (
                      <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-3 lg:px-5 lg:py-4 rounded-2xl backdrop-blur-sm ${
                    message.sender === "user"
                      ? `bg-gradient-to-r ${activeTheme.messageBg} text-white rounded-br-none shadow-lg`
                      : message.error
                      ? "bg-red-900 bg-opacity-60 text-red-100 rounded-bl-none border border-red-500 border-opacity-40"
                      : message.success
                      ? "bg-emerald-900 bg-opacity-60 text-emerald-100 rounded-bl-none border border-emerald-500 border-opacity-40"
                      : `${activeTheme.botMessageBg} text-white rounded-bl-none border border-white border-opacity-10`
                  } text-sm lg:text-base`}
                >
                  {message.text}
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gray-700 flex items-center justify-center ml-2 lg:ml-3 shadow-lg border border-white border-opacity-10">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div
          className={`border-t border-white border-opacity-10 p-3 lg:p-5 ${activeTheme.chatBg} ${activeTheme.text}`}
        >
          {!isComplete ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-3 lg:space-x-4"
            >
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-xl ${activeTheme.inputBg} flex items-center justify-center border border-white border-opacity-10`}
              >
                {getStepIcon()}
              </div>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type={step === 2 ? "password" : "text"}
                  value={input}
                  onChange={handleInputChange}
                  placeholder={getPlaceholder()}
                  className={`w-full border-0 ${activeTheme.inputBg} rounded-xl py-3 lg:py-4 pl-4 lg:pl-5 pr-12 lg:pr-14 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 text-white placeholder-gray-400 border border-white border-opacity-10 text-sm lg:text-base`}
                />
                <button
                  type="submit"
                  className={`absolute right-2 top-1.5 lg:top-2 bg-gradient-to-r ${activeTheme.button} text-white rounded-lg p-2 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center hover:opacity-90 transition-opacity`}
                >
                  <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </form>
          ) : (
            renderActionButton()
          )}
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-30px) translateX(20px);
          }
          66% {
            transform: translateY(20px) translateX(-15px);
          }
        }
        .perspective {
          perspective: 800px;
        }
      `}</style>
    </div>
  );
}
