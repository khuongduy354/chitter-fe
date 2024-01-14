export const FriendTab = ({ showFriendTab }) => {
  return (
    <div>
      <h1>FriendTab Page</h1>
      <button onClick={() => showFriendTab(false)}>Hide</button>
    </div>
  );
};
