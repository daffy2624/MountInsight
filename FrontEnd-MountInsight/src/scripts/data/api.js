import CONFIG from "../config";

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
  REKOMENDASI: `${CONFIG.ML_BASE_URL}/recommend_cbf`,
};

// export async function getData() {
//   const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
//   return await fetchResponse.json();
// }

export async function getRecommendation(data) {
  const response = await fetch(`${ENDPOINTS.REKOMENDASI}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(response);

  const result = await response.json();

  console.log("Ini Result: ", JSON.stringify(result, null, 2));
  return {
    ...result,
    ok: response.ok,
  };
}
