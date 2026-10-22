const API_URL = "https://open.er-api.com/v6/latest/";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromcurrency");
const toSelect = document.getElementById("tocurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");

// Get exchange rates for a base currency
async function getRates(base) {
  const response = await fetch(API_URL + base);
  if (!response.ok) {
    throw new Error("Request failed (" + response.status + ")");
  }
  const data = await response.json();
  if (data.result !== "success") {
    throw new Error("The API returned an error");
  }
  return data;
}

// Fill both dropdowns with all available currencies
async function loadCurrencies() {
  try {
    const data = await getRates("USD");
    const codes = Object.keys(data.rates).sort();




   const names = new Intl.DisplayNames(["en"], { type: "currency" });

codes.forEach((code) => {
  const label = code + " - " + names.of(code);
  fromSelect.add(new Option(label, code));
  toSelect.add(new Option(label, code));
});




    fromSelect.value = "USD";
    toSelect.value = "NGN";
    convert();
  } catch (error) {
    resultDiv.textContent = "Could not load currencies. Check your internet connection.";
  }
}

async function convert() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount < 0) {
    resultDiv.textContent = "Enter a valid amount.";
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;

  convertBtn.disabled = true;
  resultDiv.textContent = "Converting...";

  try {
    const data = await getRates(from);
    const rate = data.rates[to];
    const total = amount * rate;

    resultDiv.textContent =
      amount.toLocaleString() + " " + from + " = " +
      total.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " " + to;
  } catch (error) {
    resultDiv.textContent = "Conversion failed: " + error.message;
  } finally {
    convertBtn.disabled = false;
  }
}

convertBtn.addEventListener("click", convert);
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convert();
});

loadCurrencies();