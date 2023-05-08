const btn_send = document.querySelector("#btnSendMessage");
const chatMessage = document.querySelector(".chat_message");
const place = document.querySelector("#place");
const date = document.querySelector("#date");
const chatCon = document.querySelector(".chat_con");
const guideChat = document.querySelector(".guide_chat");
const loader = document.querySelector(".loader");
const restart = document.querySelector(".restart");
const chatInputCon = document.querySelector(".chat-input");

//임시로 chatcon block, guideChat은 none

chatCon.style.display = "none";
loader.style.display = "none";
restart.style.display = "none";
chatInputCon.style.display = "none";
place.focus();

let userMessages = [];
let assistantMessages = [];

const sendMessage = async () => {
  guideChat.style.display = "none";
  loader.style.display = "block";

  let myPlace = place.value;
  let myDate = date.value;

  const chatInput = document.querySelector(".chat-input input");
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add("chat_message");
  if (chatInput.value !== "") {
    chatMessageDiv.innerHTML = `<p>${chatInput.value}</p>`;
  } else {
    chatMessageDiv.innerHTML = `<p hidden>${chatInput.value}</p>`;
  }
  chatCon.appendChild(chatMessageDiv);

  userMessages.push(chatInput.value);
  chatInput.value = "";

  const response = await fetch(
    "http://localhost:3000/guide",
    // "https://l7nooap8dk.execute-api.ap-northeast-2.amazonaws.com/props/guide",
    {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        myPlace: myPlace,
        myDate: myDate,
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    }
  );
  const data = await response.json();
  console.log(data.assistant);
  assistantMessages.push(data.assistant);
  const astrologerMessage = document.createElement("div");
  astrologerMessage.classList.add("chat_message");
  astrologerMessage.innerHTML = ` <p class="assistant">${data.assistant.replace(
    /\n/g,
    "<br />"
  )}</p>`;
  chatCon.appendChild(astrologerMessage);

  // chatMessage.innerHTML += data.assistant.replace(/\n/g, "<br />");

  chatCon.style.display = "block";
  chatCon.scrollTop = chatCon.scrollHeight;
  loader.style.display = "none";
  restart.style.display = "block";
  chatInputCon.style.display = "flex";
};
const reStartF = () => {
  window.location.reload();
};

btn_send.addEventListener("click", () => {
  if (place.value == "" || date.value == "") {
    alert("내용을 입력해주세요.");
  } else {
    sendMessage();
  }
});
document.querySelector("#btnAsk").addEventListener("click", sendMessage);
restart.addEventListener("click", reStartF);
