import CONFIG from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,

  // mountain
  MOUNTAIN: `${CONFIG.BASE_URL}/mountain/{id}`,

  //comments
  ADD_COMMENTS: `${CONFIG.BASE_URL}/comments`,
  GET_COMMENTS: `${CONFIG.BASE_URL}/comments/gunung/{gunung_id}`,
  DELETE_COMMENTS: `${CONFIG.BASE_URL}/comments/{id_comment}`,

  //Profile
  GET_PROFILE: `${CONFIG.BASE_URL}/profile/{id}`,
  UPDATE_PROFILE: `${CONFIG.BASE_URL}/profile/{id}`,
};

export async function getRegister({ name, email, password, age, gender }) {
  const data = JSON.stringify({ name, email, password, age, gender });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getMountainById(id) {
  try {
    const url = ENDPOINTS.MOUNTAIN.replace("{id}", id);
    const fetchResponse = await fetch(url);

    const json = await fetchResponse.json();

    if (!fetchResponse.ok) {
      throw new Error(json.message || "Gagal mengambil data gunung");
    }

    return json; // langsung kembalikan data gunung
  } catch (error) {
    console.error("Error saat mengambil data gunung:", error.message);
    throw error; // lempar lagi agar presenter bisa menanganinya
  }
}

export async function addComment({ gunung_id, user_id, content }) {
  const data = JSON.stringify({ gunung_id, user_id, content });

  const fetchResponse = await fetch(ENDPOINTS.ADD_COMMENTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getCommentsByGunungId(gunung_id) {
  const url = ENDPOINTS.GET_COMMENTS.replace("{gunung_id}", gunung_id);

  const fetchResponse = await fetch(url);
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function deleteCommentById(id_comment) {
  const url = ENDPOINTS.DELETE_COMMENTS.replace("{id_comment}", id_comment);

  const fetchResponse = await fetch(url, {
    method: "DELETE",
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getProfileById(id) {
  const url = ENDPOINTS.GET_PROFILE.replace("{id}", id);

  const fetchResponse = await fetch(url);
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function updateProfile({ id, name, age, gender }) {
  const url = ENDPOINTS.UPDATE_PROFILE.replace("{id}", id);
  const data = JSON.stringify({ name, age, gender });

  const fetchResponse = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
