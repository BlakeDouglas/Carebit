
import * as Linking from "expo-linking";
import { encode as btoa } from "base-64";
import Moment from 'moment'
import * as WebBrowser from "expo-web-browser";

//These should be placed in the .env file =========================================
export const FITBIT_CLIENT_ID = "238QS3";
export const FITBIT_CLIENT_SECRET = "63e2e5cccc69f6e8f198b86d62b52c19";
//=================================================================================

//Custom function to extract code from url
//Js has a easier way but was not consistent so I opted for this. 
function getParam(param, url) {
    param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
    let results = null ? null : regex.exec(url)[1];
    return results
}
export async function getCode() {
    const returnUrl = Linking.createURL("/");

    let authUrl =
        "https://www.fitbit.com/oauth2/authorize" +
        `?client_id=${FITBIT_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(returnUrl)}` +
        "&response_type=code" +
        `&scope=${encodeURIComponent(
            "activity profile settings heartrate"
        )}`;

    //AuthSession.startAsync() was returning {type : "dismiss"} before the browser opened seems like a bug on their end 
    // but WebBrowser.openAuthSessionAsync() works fine in fetching the return url that we save in result
    let result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

    //get the code from the url
    let code = getParam("code", result.url);

    //Send the code to exchange with Token



    return code;
};

//we Encode the clientID and ClientSecret with base64 to generate the basic Auth Token
function getAuthHeader() {
    return `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`;
}

export async function getAuthToken() {

    let code = await getCode();
    const returnUrl = Linking.createURL("/");
    let url =
        "https://api.fitbit.com/oauth2/token" +
        "?grant_type=authorization_code" +
        `&client_id=${FITBIT_CLIENT_ID}` +
        `&redirect_uri=${returnUrl}` +
        `&code=${code}`;
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: getAuthHeader(),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        let responseJson = await response.json();
        let { access_token, refresh_token, expires_in, user_id, token_type } = responseJson;

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: user_id,
            expiry: expires_in,
            tokenType: token_type
        };
    } catch (e) {
        console.error(e);
        return new Error({
            error: e,
        });
    }
}