const urlBase = "https://www.carebit.xyz/";
const headerSettings = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Params: {body: {email, password}}
export async function loginEndpoint(body) {
  try {
    let response = await fetch(`${urlBase}login`, {
      method: "POST",
      headers: headerSettings,
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /login " + error);
  }
}

// Params: {auth, body}
export async function getDefaultEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}getDefaultRequest`, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /getDefaultRequest: " + error);
  }
}

// Params: {auth, body}
export async function caregiveeCreateEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}caregivee/create`, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /caregivee/create: " + error);
  }
}

// Params: {auth, body, targetID}
export async function caregiveeSetEndpoint(params) {
  const url = `${baseUrl}caregivee/${params.targetID}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      body: JSON.stringify(params.body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error uploading to /caregivee/<caregiveeID>: " + error);
  }
}

// Params: {auth, targetID}
export async function caregiveeGetEndpoint(params) {
  const url = `${baseUrl}caregivee/${params.targetID}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(
      "Caught error downloading from /caregivee/<caregiveeID>: " + error
    );
  }
}

// Params: {auth, body}
export async function userEndpoint(params) {
  try {
    let response = await fetch(`${urlBase}user`, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /user: " + error);
  }
}

// Params: {auth, targetID, level, selfID}
export async function activityEndpoint(params) {
  const url = `${urlBase}activity/${params.targetID}/${params.level}/${params.selfID}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const responseText = await response.text();
    return responseText;
  } catch (error) {
    console.log("Caught error in /activity: " + error);
  }
}

// Params: {auth, body}
export async function createRequestEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}createRequest`, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /createRequest: " + error);
  }
}

// Params: {auth, type (method), body, targetID}
export async function thresholdsEndpoint(params) {
  const url = `${baseURL}thresholds/${params.targetID}`;
  try {
    let response = await fetch(url, {
      method: params.type,
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      body: params.body,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /thresholds: " + error);
  }
}

// Params: {auth, targetID}
export async function setAlertOkEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}alerts/ok/${params.targetID}`, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /alerts/ok: " + error);
  }
}

// Params: {auth, targetID}
export async function getAlertsEndpoint(params) {
  try {
    const response = await fetch(`${baseUrl}alerts/${params.targetID}`, {
      method: "GET",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error from /alerts/<caregiveeID>: " + error);
  }
}

// Params: {payload, selfID, auth}
export async function notificationTokenEndpoint(params) {
  try {
    let url = `${baseUrl}notificationToken/${params.selfID}/${params.payload}`;

    let response = await fetch(url, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Caught error in /notificationToken: " + error);
  }
}

// Params: {auth, targetID, metric (all / some), period (recent / date)}
export async function fitbitDataEndpoint(params) {
  try {
    const response = await fetch(
      `${baseURL}caregivee/${params.targetID}/${params.metric}/${params.period}`,
      {
        method: "GET",
        headers: {
          ...headerSettings,
          Authorization: "Bearer " + params.auth,
        },
      }
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(
      "Caught error in /caregivee/<caregiveeID>/<metric>/recent: " + error
    );
  }
}
