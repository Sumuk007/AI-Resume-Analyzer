import React, { useState } from "react";
import axios from "axios";

function Form() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume || !jobDesc) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDesc);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://ai-resume-analyzer-htsu.onrender.com/analyze/",
        formData
      );

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
        setResult(
          "❌ Network error. Please check your connection or try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-3xl border border-gray-200">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          AI Resume Analyzer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Upload Resume (PDF)
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded hover:bg-blue-200 transition"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm">
                {resume ? resume.name : "No file selected"}
              </span>
            </div>

            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={5}
              placeholder="Enter the job description here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-800 whitespace-pre-wrap">
            <strong className="block text-blue-800 mb-2">AI Feedback:</strong>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
