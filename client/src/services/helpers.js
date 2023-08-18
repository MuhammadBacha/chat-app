export async function fetchMessages(token, chatName) {
  const response = await fetch(
    `https://chat-app-bice-ten.vercel.app/${chatName}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  if (data.status === "failure") {
    // show the modal, rest will be handled by the modal click
    window.log_again_modal.showModal();
  }
  return data;
}
