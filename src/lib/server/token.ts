import { HELLOASSO_CLIENT_ID, HELLOASSO_SECRET_ID } from '$env/static/private'
const url = "https://api.helloasso.com/oauth2/token";

type Token = { access_token: string, refresh_token: string }

export function generateToken(): Promise<Token> {
    return fetch(url, {
        method: "POST",
        body: generateRequestBody('generateToken')
    }).then(resp => resp.json());
}

export async function refreshToken(refresh_token: string): Promise<Token> {
    let token = await fetch(url, {
        method: "POST",
        body: generateRequestBody('refreshToken', refresh_token)
    }).then(resp => resp.json());

    if (token.error) {
        token = await generateToken();
    }
    return token;
}

function generateRequestBody(type: string, refresh_token?: string) {
    let res = []
    if (['generateToken', 'refreshToken'].includes(type)) {
        res.push(`client_id=${encodeURIComponent(HELLOASSO_CLIENT_ID)}`);
    }
    if (type === 'generateToken') {
        res.push(`client_secret=${encodeURIComponent(HELLOASSO_SECRET_ID)}`)
        res.push('grant_type=client_credentials')
    }
    if (type === 'refreshToken') {
        res.push('grant_type=refresh_token')
        if (refresh_token) {
            res.push(`refresh_token=${encodeURIComponent(refresh_token)}`)
        }
    }
    return res.join('&');
}