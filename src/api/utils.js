import {API_KEY, WS_URL} from "@/api/constants";

export const getWSUrl = () => {
    const wsUrl = new URL(WS_URL);
    wsUrl.pathname = 'v2';
    wsUrl.searchParams.append('api_key', API_KEY);
    return wsUrl;
};
