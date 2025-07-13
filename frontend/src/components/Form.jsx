import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, Zap, CheckCircle, AlertCircle, Loader2, Copy, Check, RefreshCw, Wifi, WifiOff } from "lucide-react";

function Form({ serverStatus, onRefreshStatus }) {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if server is available for requests
  const isServerAvailable = serverStatus === 'live';
  const isServerWaking = serverStatus === 'waking';
  const isServerOffline = serverStatus === 'offline';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume || !jobDesc) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    // Check server status before making request
    if (!isServerAvailable) {
      if (isServerWaking) {
        alert("Server is waking up. Please wait a moment and try again.");
        return;
      } else if (isServerOffline) {
        alert("Server is offline. Please check your connection or try again later.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDesc);

    try {
      setLoading(true);

      const res = await axios.post("https://ai-resume-analyzer-htsu.onrender.com/analyze/", formData);

      if (res.data?.result) {
        setResult(res.data.result);
      } else if (res.data?.analysis) {
        setResult(res.data.analysis);
      } else if (res.data?.error) {
        setResult("❌ Server responded with an error: " + res.data.error);
      } else {
        setResult("❌ Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error:", err);

      if (err.response?.status === 429) {
        setResult("⚠️ Rate limit exceeded. Please try again in a few minutes.");
      } else if (err.response?.data?.error) {
        setResult("❌ Error from server: " + err.response.data.error);
      } else {
        setResult("❌ Network error. Please check your connection or try again.");
        // Trigger server status refresh when network error occurs
        if (onRefreshStatus) {
          onRefreshStatus();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatResult = (text) => {
    // Clean up the text first
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
    
    // Split into sections based on common patterns
    const sections = cleanText.split(/\n\s*\n/).filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return null;
      
      // Check if this is a main section (usually the first line is a header)
      const firstLine = lines[0].trim();
      const isMainSection = firstLine.length > 0 && 
        (firstLine.includes('Analysis') || 
         firstLine.includes('Summary') || 
         firstLine.includes('Recommendations') || 
         firstLine.includes('Skills') || 
         firstLine.includes('Experience') || 
         firstLine.includes('Education') || 
         firstLine.includes('Improvements') ||
         firstLine.includes('Match') ||
         firstLine.includes('Score') ||
         firstLine.includes('Feedback') ||
         firstLine.includes('Strengths') ||
         firstLine.includes('Weaknesses'));
      
      if (isMainSection) {
        return (
          <div key={index} className="mb-8 border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              {firstLine}
            </h2>
            <div className="space-y-3">
              {lines.slice(1).map((line, lineIndex) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;
                
                // Check if it's a sub-heading (usually contains colons or is short)
                const isSubHeading = trimmedLine.includes(':') && trimmedLine.length < 100;
                
                if (isSubHeading) {
                  const [heading, ...contentParts] = trimmedLine.split(':');
                  const content = contentParts.join(':').trim();
                  
                  return (
                    <div key={lineIndex} className="mb-4 ml-4">
                      <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                        {heading.trim()}
                      </h3>
                      {content && (
                        <p className="text-slate-300 ml-6 leading-relaxed bg-slate-800/30 p-3 rounded-lg">
                          {content}
                        </p>
                      )}
                    </div>
                  );
                }
                
                // Check if it's a numbered or bulleted item
                const numberedMatch = trimmedLine.match(/^(\d+)\.?\s*(.+)/);
                const bulletMatch = trimmedLine.match(/^[-•·]\s*(.+)/);
                
                if (numberedMatch) {
                  return (
                    <div key={lineIndex} className="mb-3 ml-8">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                          {numberedMatch[1]}
                        </div>
                        <p className="text-slate-300 leading-relaxed flex-1 bg-slate-800/20 p-2 rounded">
                          {numberedMatch[2]}
                        </p>
                      </div>
                    </div>
                  );
                }
                
                if (bulletMatch) {
                  return (
                    <div key={lineIndex} className="mb-2 ml-8">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-slate-300 leading-relaxed bg-slate-800/20 p-2 rounded">
                          {bulletMatch[1]}
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Regular content
                return (
                  <p key={lineIndex} className="text-slate-300 leading-relaxed ml-6 mb-2 bg-slate-800/20 p-2 rounded">
                    {trimmedLine}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }
      
      // Handle standalone content blocks
      return (
        <div key={index} className="mb-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Check for sub-headings
            const isSubHeading = trimmedLine.includes(':') && trimmedLine.length < 100;
            
            if (isSubHeading) {
              const [heading, ...contentParts] = trimmedLine.split(':');
              const content = contentParts.join(':').trim();
              
              return (
                <div key={lineIndex} className="mb-3">
                  <h4 className="text-base font-medium text-yellow-400 mb-1 flex items-center">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
                    {heading.trim()}
                  </h4>
                  {content && (
                    <p className="text-slate-300 ml-4 leading-relaxed">
                      {content}
                    </p>
                  )}
                </div>
              );
            }
            
            return (
              <p key={lineIndex} className="text-slate-300 leading-relaxed mb-2">
                {trimmedLine}
              </p>
            );
          })}
        </div>
      );
    }).filter(Boolean);
  };

  // Get button text and styling based on server status
  const getButtonConfig = () => {
    if (loading) {
      return {
        text: "Analyzing...",
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        disabled: true,
        className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg opacity-50 cursor-not-allowed flex items-center justify-center space-x-2"
      };
    }

    if (isServerOffline) {
      return {
        text: "Server Offline",
        icon: <WifiOff className="w-5 h-5" />,
        disabled: true,
        className: "w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg opacity-50 cursor-not-allowed flex items-center justify-center space-x-2"
      };
    }

    if (isServerWaking) {
      return {
        text: "Server Waking Up...",
        icon: <Wifi className="w-5 h-5 animate-pulse" />,
        disabled: true,
        className: "w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg opacity-50 cursor-not-allowed flex items-center justify-center space-x-2"
      };
    }

    return {
      text: "Analyze Resume",
      icon: <Zap className="w-5 h-5" />,
      disabled: false,
      className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-4xl border border-slate-700/50 animate-fadeIn">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-400 text-lg">
            Get intelligent insights about your resume compatibility
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="block text-slate-300 font-medium text-lg">
              Upload Resume (PDF)
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                dragActive
                  ? "border-blue-400 bg-blue-500/10"
                  : resume
                  ? "border-green-400 bg-green-500/10"
                  : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                {resume ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-400 animate-bounce" />
                    <div className="text-center">
                      <p className="text-green-400 font-medium text-lg">{resume.name}</p>
                      <p className="text-slate-400 text-sm">File uploaded successfully</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400" />
                    <div className="text-center">
                      <p className="text-slate-300 font-medium text-lg">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-slate-400 text-sm">PDF files only</p>
                    </div>
                  </>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!isServerAvailable && !isServerWaking}
              />
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-3">
            <label className="block text-slate-300 font-medium text-lg">
              Paste Job Description
            </label>
            <div className="relative">
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={6}
                placeholder="Enter the job description here..."
                className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                disabled={!isServerAvailable && !isServerWaking}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {jobDesc.length} characters
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={buttonConfig.disabled}
            className={buttonConfig.className}
          >
            {buttonConfig.icon}
            <span>{buttonConfig.text}</span>
          </button>
        </form>

        {/* Enhanced Results Section */}
        {result && (
          <div className="mt-8 bg-slate-700/50 border border-slate-600 rounded-xl animate-slideIn overflow-hidden">
            {/* Result Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/50 bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-400">AI Feedback</h2>
                  <p className="text-slate-400 text-sm">Resume analysis results</p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-600/50 hover:bg-slate-600 rounded-lg transition-colors duration-200 group"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                )}
                <span className="text-sm text-slate-400 group-hover:text-white">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>

            {/* Result Content */}
            <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                {formatResult(result)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}

export default Form;