const buttons = document.querySelectorAll('.buttons button');
const statusElement = document.querySelector('#status');
const outputElement = document.querySelector('#output');

async function callApi(method, url) {
  statusElement.textContent = 'Loading...';
  outputElement.textContent = '';

  try {
    const response = await fetch(url, { method: method });
    const text = await response.text();

    statusElement.textContent = `${response.status} ${response.statusText}`;

    try {
      const data = JSON.parse(text);
      outputElement.textContent = JSON.stringify(data, null, 2);
    } catch {
      outputElement.textContent = text;
    }
  } catch (error) {
    statusElement.textContent = 'Network error';
    outputElement.textContent = `The request failed: ${error.message}`;
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    callApi(button.dataset.method, button.dataset.url);
  });
});