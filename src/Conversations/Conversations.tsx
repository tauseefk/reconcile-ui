import { useEffect, useState } from "react";
import { deleteConversation, getConversationsList, IConvData } from "../api";
import "./styles.scss";

export const Conversations = () => {
  const [conversationsData, setConversationsData] = useState<IConvData[]>([]);
  const [expanded, setExpanded] = useState<string | null>();

  useEffect(() => {
    getConversationsList().then((c) => setConversationsData(c));
  }, []);

  const toggleConversationFavorite = (id: string) => {
    setConversationsData(
      conversationsData.map((convData: IConvData) => {
        if (convData.id === id)
          return { ...convData, isFavorite: !convData.isFavorite };
        return convData;
      })
    );
  };

  const handleToggleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  const deleteConversationFromState = (id: string) => {
    setConversationsData(
      conversationsData.filter((convData: IConvData) => convData.id !== id)
    );
  };

  const handleDeleteConversation = async (id: string) => {
    const confirmation = window.confirm(
      "Do you really want to delete this conversation?"
    );

    if (confirmation) {
      try {
        await deleteConversation({ id });
        deleteConversationFromState(id);
      } catch (e) {
        console.log("Failed to delete conversation.");
      }
    }
  };

  const conversations = conversationsData.map((c: IConvData, idx: number) => {
    return (
      <ConversationItem
        key={idx}
        id={c.id}
        text={c.text}
        mutation={c.lastMutation}
        isFavorite={c.isFavorite}
        isExpanded={c.id === expanded}
        deleteConversation={handleDeleteConversation}
        toggleFavorite={toggleConversationFavorite}
        toggleExpand={handleToggleExpand}
      />
    );
  });

  return (
    <div className="conversations">
      {conversations.length ? conversations : <EmptyLabel />}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://reconcile-text.herokuapp.com"
        className="live-view"
      >
        Live View ⚡️
      </a>
    </div>
  );
};

const EmptyLabel = () => {
  return (
    <div className="conversation-item">
      <div className="empty">
        <div>No conversations.</div>
        <div className="font-small">
          run BE test cases to get some projects back fast.
        </div>
      </div>
    </div>
  );
};

interface IConversationProps {
  id: string;
  isFavorite: boolean;
  isExpanded: boolean;
  text: string;
  mutation: any;
  deleteConversation: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleExpand: (id: string) => void;
}
const ConversationItem = ({
  id,
  isFavorite,
  isExpanded,
  text,
  mutation,
  deleteConversation,
  toggleFavorite,
  toggleExpand,
}: IConversationProps) => {
  return (
    <div
      className={
        isExpanded ? "conversation-item expanded" : "conversation-item"
      }
    >
      <div
        onClick={() => toggleFavorite(id)}
        className={isFavorite ? "fav isFavorite" : "fav"}
      ></div>
      <div
        onClick={() => toggleExpand(id)}
        className="conversation-item-content"
      >
        <div>{id}: </div>
        <div className="font-small">{text}</div>
        <div className="font-small mutation">{JSON.stringify(mutation)}</div>
      </div>
      <div onClick={() => deleteConversation(id)} className="delete">
        x
      </div>
    </div>
  );
};
