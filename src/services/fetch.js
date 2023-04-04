import { store } from "../store";

const postRequest = (fullUrl, data) => {
  const token = localStorage.getItem("token");
  let headers = "";

  if (token) {
    headers = {
      "Content-Type": "text/html",
      Authorization: `Bearer ${token}`,
    };
  } else {
    headers = {
      "Content-Type": "text/html",
    };
  }
  const body = data;

  return fetch(fullUrl, {
    credentials: "same-origin",
    method: "POST",
    body,
    headers: new Headers(headers),
  }).then((response) => {
    return response.json().then((data) => {
      const json = JSON.parse(data);

      if (!response.ok) {
        return Promise.reject(json);
      }

      return Promise.resolve(json);
    });
  });
};

const getRequest = (fullUrl) => {
  const token = localStorage.getItem("token");
  let headers = "";

  if (token) {
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  return fetch(fullUrl, {
    credentials: "same-origin",
    method: "GET",
    headers: new Headers(headers),
  }).then((response) => {
    return response.text().then((data) => {
      const json = JSON.parse(data);

      if (!response.ok) {
        return Promise.reject(json);
      }

      return Promise.resolve(json);
    });
  });
};

const validateToken = () => {
  const token = localStorage.getItem("token");
  let headers = "";

  if (token) {
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  return fetch(`${import.meta.env.VITE_API_ROOT}/secure/validate`, {
    credentials: "same-origin",
    method: "GET",
    headers: new Headers(headers),
  }).then((response) =>
    response.text().then((data) => {
      const { data: dataResponse } = JSON.parse(data);

      const dataDecrypted = cryptoJs.AES.decrypt(dataResponse, key, {
        iv,
      }).toString(Utf8);

      const json = JSON.parse(dataDecrypted);

      if (!response.ok) {
        return Promise.reject(json);
      }

      return Promise.resolve(json);
    })
  );
};

export const API = ({ endpoint, method = "GET", body = {}, actions, keyName = "", mustValidateToken = false }) => {
  const [requestAction, successAction, failureAction] = actions;
  const { dispatch, getState } = store;
  // const { online } = getState().offline;
  const online = true;

  let fullUrl = "";

  if (typeof endpoint !== "string") {
    throw new Error("Specify a string endpoint URL.");
  }
  if (typeof method !== "string") {
    throw new Error("Specify a string method type.");
  }
  if (!Array.isArray(actions) || actions.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }
  if (!actions.every((type) => typeof type === "function")) {
    throw new Error("Expected actions to be functions.");
  }
  if (method !== "GET" && method !== "POST") {
    throw new Error("Specify a valid method type.");
  }
  if (method === "GET" && keyName == "") {
    console.warn("keyName is undefined, please set a valid keyName.");
  }
  if (!endpoint.includes("http")) {
    fullUrl = `${import.meta.env.VITE_API_ROOT}/${endpoint}`;
  } else {
    fullUrl = endpoint;
  }

  if (mustValidateToken) {
    return validateToken()
      .then((response) => {
        if (response.data.status == 200) {
          dispatch({ type: requestAction });
          if (method === "POST") {
            return postRequest(fullUrl, body)
              .then((response) => {
                dispatch({ type: successAction, payload: response });
                return response;
              })
              .catch((error) => {
                dispatch({ type: failureAction, payload: error || "Something bad happened" });
                return error;
              });
          } else {
            return getRequest(fullUrl)
              .then((response) => {
                dispatch({ type: successAction, payload: response });
                return response;
              })
              .catch((error) => {
                dispatch({ type: failureAction, payload: error || "Something bad happened" });
                return error;
              });
          }
        } else {
          dispatch({ type: "LOGOUT" });
          return console.error("Your session has expired. Please login again.");
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: "LOGOUT" });
        return Promise.reject(error);
      });
  }

  dispatch(requestAction(true));
  if (online) {
    if (method === "POST") {
      return postRequest(fullUrl, body)
        .then((response) => {
          dispatch(successAction(response));
          return response;
        })
        .catch((error) => {
          dispatch(failuteType({ error: true, message: error || "Something bad happened" }));
          return error;
        })
        .finally(() => dispatch(requestAction(false)));
    } else {
      return getRequest(fullUrl)
        .then((response) => {
          dispatch(successAction(response));
          return response;
        })
        .catch((error) => {
          dispatch(failureAction({ error: true, message: error || "Something bad happened" }));
          return error;
        })
        .finally(() => dispatch(requestAction(false)));
    }
  } else {
    if (method === "POST") {
      return { error: true, message: "You cannot use POST method if you are offline." };
    }
    if (method === "GET") {
      dispatch({ type: requestAction });
      try {
        if (!localStorage.getItem(`offline:${keyName}`)) {
          dispatch({ type: failureAction });
          throw new Error(`${keyName} is undefined. Please check if this exist in the local storage`);
        }
        const dataEncrypted = localStorage.getItem(`offline:${keyName}`).replaceAll('"', "");
        const dataDecrypted = JSON.parse(cryptoJs.AES.decrypt(dataEncrypted, import.meta.env.VITE_SALT).toString(Utf8));
        const { data } = dataDecrypted;
        console.log("data: ", data, dataEncrypted, dataDecrypted);
        dispatch({ type: successAction, payload: data });
        return Promise.resolve(data);
      } catch (error) {
        dispatch({ type: failureAction });
        return Promise.reject(error);
      }
    }
  }
};
