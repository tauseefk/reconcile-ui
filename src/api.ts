import axios from "axios";
window.PRODUCTION =
  window.location.host === "https://reconcile-ui.herokuapp.com";

export function getRootUrl() {
  return window.PRODUCTION
    ? "https://reconcile-txt.herokuapp.com"
    : "http://localhost:3000";
}

export function getAPIUrl() {
  return `${getRootUrl()}/api/v0`;
}

export interface IConvData {
  id: string;
  isFavorite: boolean;
  text: string;
  lastMutation: any;
}

export async function getConversationsList() {
  const response = await axios.request<{ conversations: IConvData[] }>({
    method: "get",
    url: `${getAPIUrl()}/conversations`,
  });

  return response.data.conversations;
}

export const deleteConversation = async ({
  id,
}: {
  id: string;
}) => {
  return axios.delete<{ id: string }>(
    `${getAPIUrl()}/conversations/${id}`
  );
};
