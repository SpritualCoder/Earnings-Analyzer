import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${BASE_URL}/api/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
