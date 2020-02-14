require("dotenv").config();

const fetch = require("node-fetch");
const Telegram = require("node-telegram-bot-api");

const weatherToken = process.env.OPEN_WEATHER_MAP_TOKEN;
const telegramToken = process.env.TELEGRAM_API_TOKEN;
const telegramChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
const telegramBotChatId = process.env.TELEGRAM_BOT_CHAT_ID;

const bot = new Telegram(telegramToken);
const weatherURL = new URL("https://api.openweathermap.org/data/2.5/weather");
weatherURL.searchParams.set("q", "Kyiv,ua");
weatherURL.searchParams.set("appid", weatherToken);
weatherURL.searchParams.set("units", "metric");

async function getWeatherData() {
	try {
		const res = await fetch(weatherURL.toString());
		const body = await res.json();
		return body;
	} catch(e) {
		throw new Error(e);
	}
}

function generateWeatherMessage(weatherData) {
	return `Погодка в ${weatherData.name}: ${weatherData.weather[0].description}. Температура: ${weatherData.main.temp}. Feals like: ${weatherData.main.feels_like}`;
}

async function main() {
	try {
		const data = await getWeatherData();
		const message = generateWeatherMessage(data);
		bot.sendMessage(telegramChatId, message);
		bot.sendMessage(telegramBotChatId, message);
	} catch(e) {
		throw new Error(e);
	}
}

main();
