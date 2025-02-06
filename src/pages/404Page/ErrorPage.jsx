import { Link } from "react-router-dom";
import React from 'react';
import { Heart as Heartbeat, Stethoscope, ArrowLeft, Pill, Syringe, ChevronFirst as FirstAid, Activity, Clipboard, Thermometer, Battery as Bacteria } from 'lucide-react';

const ErrorPage = () => {
  return (
    <>
      <div className="min-h-screen h-vh bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4 overflow-hidden">
        {/* Enhanced Background DNA Helix Animation */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-24 w-24 rounded-full border-4 border-blue-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `dnaFloat ${10 + Math.random() * 5}s linear infinite, pulse ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${-Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Animated Background Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`pattern-${i}`}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `patternFloat ${15 + Math.random() * 10}s linear infinite`
              }}
            >
              <Bacteria
                size={48 + Math.random() * 24}
                className="text-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="max-w-4xl w-full text-center relative">
          {/* Enhanced Floating Medical Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Stethoscope
              className="absolute top-0 left-1/4 text-blue-200 animate-float transform-gpu"
              size={48}
            />
            <Heartbeat
              className="absolute bottom-1/4 right-1/4 text-red-200 animate-float-delayed transform-gpu"
              size={48}
            />
            <Pill
              className="absolute top-1/4 right-1/3 text-green-200 animate-float-slow transform-gpu"
              size={32}
            />
            <Syringe
              className="absolute bottom-1/3 left-1/3 text-purple-200 animate-float-slower transform-gpu"
              size={32}
            />
            <Clipboard
              className="absolute top-1/2 left-1/4 text-yellow-400 animate-float-slowest transform-gpu"
              size={40}
            />
            <Thermometer
              className="absolute bottom-1/4 left-1/2 text-orange-400 animate-thermometer transform-gpu"
              size={36}
            />
          </div>

          {/* Main content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 relative z-10 border border-blue-100">
            {/* Animated MedB Logo */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg animate-ping opacity-20"></div>
                <div className="absolute inset-0 bg-blue-400 rounded-lg animate-pulse opacity-10"></div>
                <div className="text-blue-600 text-4xl font-bold p-4 tracking-tight animate-float-subtle">
                  MedB
                  <Stethoscope className="inline-block ml-1 text-red-500" size={32} />
                </div>
              </div>
            </div>

            <h1 className="text-8xl md:text-9xl font-bold text-blue-600 mb-4 animate-pulse relative">
              404
              <Activity
                className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-red-500 animate-pulse"
                size={64}
              />
            </h1>

            <div className="space-y-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 animate-fade-in">
                Page Not Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto animate-fade-in-delayed">
                Oops! It seems like this medical record has been misplaced.<br />
                Our MedB team is already working on it!
              </p>
            </div>

            {/* Enhanced ECG Animation */}
            <div className="h-16 mb-8 flex items-center justify-center bg-black/5 rounded-xl overflow-hidden group">
              <svg className="w-full max-w-md transform transition-transform group-hover:scale-105" height="60" viewBox="0 0 600 100">
                <path
                  className="pulse"
                  d="M0,50 L100,50 L130,30 L160,70 L190,30 L220,70 L250,30 L280,70 L310,30 L340,70 L370,30 L400,70 L430,30 L460,70 L490,30 L520,70 L550,30 L580,70 L600,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  style={{
                    filter: 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.5))',
                  }}
                />
              </svg>
            </div>

            {/* Enhanced Back to Home Button */}
            <Link to={'/'}
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 animate-gradient"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-shimmer"></span>
              <span className="relative flex items-center">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Return back to MedB Home
              </span>
            </Link>
          </div>
        </div>

        {/* Enhanced Animation Styles */}
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-20px) rotate(5deg) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(-5deg) scale(1.05); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(10deg) scale(1.15); }
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(-10deg) scale(1.1); }
        }

        @keyframes float-slowest {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-20px) rotate(15deg) scale(1.05); }
        }

        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes dash {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: -1000;
          }
        }

        @keyframes dnaFloat {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes patternFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-50px, -50px) rotate(360deg); }
        }

        @keyframes thermometer {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite 2s;
        }

        .animate-float-slower {
          animation: float-slower 9s ease-in-out infinite 3s;
        }

        .animate-float-slowest {
          animation: float-slowest 10s ease-in-out infinite 4s;
        }

        .animate-float-subtle {
          animation: float-subtle 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
          opacity: 0.1;
        }

        .animate-thermometer {
          animation: thermometer 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delayed {
          opacity: 0;
          animation: fade-in 0.6s ease-out forwards 0.3s;
        }

        .pulse {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 3s linear infinite;
        }
      `}</style>
      </div>
    </>
  );
};

export default ErrorPage;