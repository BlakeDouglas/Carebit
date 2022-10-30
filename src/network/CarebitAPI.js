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
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /login: " + responseText;
    }
    const json = JSON.parse(responseText);
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
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /getDefaultRequest: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /getDefaultRequest: " + error);
  }
}

// Params: {auth, body}
export async function setDefaultEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}setDefaultRequest`, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /setDefaultRequest: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /setDefaultRequest: " + error);
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
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /caregivee/create: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /caregivee/create: " + error);
  }
}

// Params: {auth, body, targetID}
export async function caregiveeSetEndpoint(params) {
  const url = `${urlBase}caregivee/${params.targetID}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /caregivee/<caregiveeID>: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error uploading to /caregivee/<caregiveeID>: " + error);
  }
}

// Params: {auth, targetID}
export async function caregiveeGetEndpoint(params) {
  const url = `${urlBase}caregivee/${params.targetID}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /caregivee/<caregiveeID>: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log(
      "Caught error downloading from /caregivee/<caregiveeID>: " + error
    );
  }
}

// Params: body
export async function userEndpoint(body) {
  try {
    let response = await fetch(`${urlBase}user`, {
      method: "POST",
      headers: headerSettings,
      body: JSON.stringify(body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /user: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /user: " + error);
  }
}

// Params: {auth, selfID}
export async function getRequestCount(params) {
  const url = `${urlBase}getRequestCount/${params.selfID}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /activity: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log("Caught error in /getRequestCount: " + error);
  }
}

// Params: {auth, targetID, level, selfID}
export async function setActivityEndpoint(params) {
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
    if (responseText.startsWith("<")) {
      throw "Server error in /activity: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log("Caught error in /activity: " + error);
  }
}

// Params: {auth, body}
export async function setDefaultActivityEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}/updateHealthProfile`, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /updateHealthProfile: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log("Caught error in /updateHealthProfile: " + error);
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
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /createRequest: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /createRequest: " + error);
  }
}

// Params: {auth, targetID}
export async function deleteRequestEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}deleteRequest/${params.targetID}`, {
      method: "DELETE",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /deleteRequest: " + responseText;
    }
    if (responseText === "") {
      return responseText;
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.log("Caught error in /deleteRequest: " + error);
  }
}

// Params: {auth, body}
export async function acceptRequestEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}acceptRequest`, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /acceptRequest: " + responseText;
    }
    if (responseText === "") return "";
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /acceptRequest: " + error);
  }
}

// Params: {auth, body}
export async function getRequestsEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}getRequests`, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /getRequests: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /getRequests: " + error);
  }
}

// Params: {auth, type (method), body, targetID, selfID}
export async function thresholdsEndpoint(params) {
  const url = `${urlBase}thresholds/${params.targetID}/${params.selfID}`;
  try {
    let response = await fetch(url, {
      method: params.type,
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /thresholds: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /thresholds: " + error);
  }
}

export async function physicianEndpoint(params) {
  try {
    let response = await fetch(`${urlBase}physician`, {
      method: "PUT",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /physician: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /physician: " + error);
  }
}

// Params: {auth, targetID}
export async function setAlertOkEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}alerts/ok/${params.targetID}`, {
      method: "PUT",
      headers: headerSettings,
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /alerts/ok: " + responseText;
    }
    if (responseText === "") return "";
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /alerts/ok: " + error);
  }
}

// Params: {auth, targetID}
export async function getAlertsEndpoint(params) {
  try {
    const response = await fetch(
      `${urlBase}alerts/${params.targetID}/${params.selfID}`,
      {
        method: "GET",
        headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      }
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(
      "Caught error from /alerts/<caregiveeID>/<int:caregiverID>: " + error
    );
  }
}

// Params: {auth, targetID}
export async function setNoSyncAlert(params) {
  try {
    console.log(`${urlBase}noSyncAlert/${params.targetID}`);
    const response = await fetch(`${urlBase}noSyncAlert/${params.targetID}`, {
      method: "POST",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /noSyncAlert/<caregiveeID>: " + responseText;
    }
    if (responseText === "") return responseText;
    else return JSON.parse(responseText);
  } catch (error) {
    console.log("Caught error in /noSyncAlert/<caregiveeID>: " + error);
  }
}

// Params: {payload, selfID, auth}
export async function notificationTokenEndpoint(params) {
  try {
    let url = `${urlBase}notificationToken/${params.selfID}/${params.payload}`;
    let response = await fetch(url, {
      method: "POST",
      headers: {
        ...headerSettings,
        Authorization: "Bearer " + params.auth,
      },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /notificationToken: " + responseText;
    } else if (!responseText) return "";
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error in /notificationToken: " + error);
  }
}

// Params: {auth, targetID, metric (all / some), period (recent / date)}
export async function fitbitDataEndpoint(params) {
  try {
    const response = await fetch(
      `${urlBase}caregivee/${params.targetID}/${params.metric}/${params.period}`,
      {
        method: "GET",
        headers: {
          ...headerSettings,
          Authorization: "Bearer " + params.auth,
        },
      }
    );
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw (
        "Server error in /caregivee/<caregiveeID>/<metric>/recent: " +
        responseText
      );
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log(
      "Caught error in /caregivee/<caregiveeID>/<metric>/recent: " + error
    );
  }
}

// Params: {auth, targetID}
export async function logoutEndpoint(params) {
  try {
    const response = await fetch(`${urlBase}logout/${params.targetID}`, {
      method: "DELETE",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /logout: " + responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log("Caught error from /logout: " + error);
  }
}
