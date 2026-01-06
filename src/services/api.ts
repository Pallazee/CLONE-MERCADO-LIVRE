const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL não definida");
}

export async function createPreference() {
  const response = await fetch(`${API_URL}/create_preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao criar preferência");
  }

  return response.json();
}
