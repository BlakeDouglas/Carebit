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
    console.log(
      "Caught error in /login ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /getDefaultRequest: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /setDefaultRequest: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /caregivee/create: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}

// Params: {auth, targetID, selfID}
export async function alertCounter(params) {
  const url = `${urlBase}alertCounter/${params.targetID}/${params.selfID}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw (
        "Server error in /alertCounter/<caregiveeID>/<caregiverID>: " +
        responseText
      );
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log(
      "Caught error from /alertCounter/<caregiveeID>/<caregiverID>: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error uploading to /caregivee/<caregiveeID>: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
      "Caught error downloading from /caregivee/<caregiveeID>: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
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
    console.log(
      "Caught error in /user: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}

// Params: {auth, targetID, time}
export async function getLastNoSyncAlert(params) {
  const url = `${urlBase}lastSyncAlert/${params.targetID}/${params.time}`;
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
      throw "Server error in /lastSyncAlert: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log(
      "Caught error in /lastSyncAlert: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}

// Params: {auth, targetID, time}
export async function setLastNoSyncAlert(params) {
  const url = `${urlBase}lastSyncAlert/${params.targetID}/${params.time}`;
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
      throw "Server error in /lastSyncAlert: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log(
      "Caught error in /lastSyncAlert: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
      throw "Server error in /getRequestCount: " + responseText;
    }
    return responseText;
  } catch (error) {
    console.log(
      "Caught error in /getRequestCount: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /activity: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /updateHealthProfile: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /createRequest: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /deleteRequest: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /acceptRequest: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /getRequests: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /thresholds: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /physician: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}

// Params: {auth, type (method), body (optNumber, selfID)}
export async function optHolder(params) {
  const url = `${urlBase}optCaregivee`;
  try {
    let response = await fetch(url, {
      method: params.type,
      headers: { ...headerSettings, Authorization: "Bearer " + params.auth },
      body: JSON.stringify(params.body),
    });
    const responseText = await response.text();
    if (responseText.startsWith("<")) {
      throw "Server error in /optCaregivee: " + responseText;
    }
    if (responseText === "") {
      return responseText;
    }
    const json = JSON.parse(responseText);
    return json;
  } catch (error) {
    console.log(
      "Caught error in /optCaregivee: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /alerts/ok: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
      "Caught error from /alerts/<caregiveeID>/<int:caregiverID>: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}

// Params: {auth, targetID}
export async function setNoSyncAlert(params) {
  try {
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
    console.log(
      "Caught error in /noSyncAlert/<caregiveeID>: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
    console.log(
      "Caught error in /notificationToken: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
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
      "Caught error in /caregivee/<caregiveeID>/<metric>/recent: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
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
    console.log(
      "Caught error from /logout: ",
      error,
      "\nAfter recieving these parameters: \n",
      params
    );
  }
}
