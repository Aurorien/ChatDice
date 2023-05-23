function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ul = document.getElementById("dicehistory");
const url = "http://localhost:3000/dicehistory";

fetch(url)
  .then((resp) => resp.json())
  .then(function (data) {
    console.log(data);
    let message = data;
    return message.map(function (data) {
      let li = createNode("li");
      li.innerHTML = `${data.date}\xa0\xa0\xa0 ${data.user} :\xa0\xa0Kastpoäng: ${data.dice_value}\xa0\xa0\xa0Total poäng: ${data.total_dice_value}`;
      append(ul, li);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
