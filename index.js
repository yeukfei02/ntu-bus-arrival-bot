const env = require("dotenv");
env.config();

const TelegramBot = require("node-telegram-bot-api");
const _ = require("lodash");

const { blueBusRequest } = require("./api/blueBus");
const { redBusRequest } = require("./api/redBus");
const { yellowBusRequest } = require("./api/yellowBus");
const { greenBusRequest } = require("./api/greenBus");
const { brownBusRequest } = require("./api/brownBus");
const { busStopDetailsRequest } = require("./api/busStopDetails");
const { busArrivalRequest } = require("./api/busArrival");

const token = process.env.TELEGRAM_BOT_TOKEN
  ? process.env.TELEGRAM_BOT_TOKEN
  : "";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const smileEmoji = String.fromCodePoint(0x1f603);
  const busEmoji = String.fromCodePoint(0x1f68c);
  const busEmoji2 = String.fromCodePoint(0x1f68d);
  const busEmoji3 = String.fromCodePoint(0x1f68e);
  const busEmoji4 = String.fromCodePoint(0x1f690);
  const contactUsEmoji = String.fromCodePoint(0x1f4e7);

  await bot.sendMessage(
    msg.chat.id,
    `Welcome to Ntu Bus Arrival Bot ${smileEmoji}`,
    {
      reply_markup: {
        keyboard: [
          [`${busEmoji} Blue Bus`],
          [`${busEmoji} Red Bus`],
          [`${busEmoji2} Yellow Bus`],
          [`${busEmoji3} Green Bus`],
          [`${busEmoji4} Brown Bus`],
          [`${contactUsEmoji} Contact Us`],
        ],
      },
    }
  );
});

bot.on("message", async (msg) => {
  if (msg.text.toString().includes("Blue Bus")) {
    const blueBus = await blueBusRequest();
    if (blueBus) {
      const name = blueBus.name;
      const vehicles = blueBus.vehicles;

      if (!_.isEmpty(vehicles)) {
        if (name) {
          await bot.sendMessage(msg.chat.id, `<b>Blue Bus</b>: ${name}`, {
            parse_mode: "HTML",
          });
        }
        await showBusLocation(msg, vehicles);
        await showBusShopDetails(msg, "blueBus");
      } else {
        const emptyEmoji = String.fromCodePoint(0x274c);
        await bot.sendMessage(
          msg.chat.id,
          `No blue bus available ${emptyEmoji}`
        );
      }
    }
  } else if (msg.text.toString().includes("Red Bus")) {
    const redBus = await redBusRequest();
    if (redBus) {
      const name = redBus.name;
      const vehicles = redBus.vehicles;

      if (!_.isEmpty(vehicles)) {
        if (name) {
          await bot.sendMessage(msg.chat.id, `<b>Red Bus</b>: ${name}`, {
            parse_mode: "HTML",
          });
        }
        await showBusLocation(msg, vehicles);
        await showBusShopDetails(msg, "redBus");
      } else {
        const emptyEmoji = String.fromCodePoint(0x274c);
        await bot.sendMessage(
          msg.chat.id,
          `No red bus available ${emptyEmoji}`
        );
      }
    }
  } else if (msg.text.toString().includes("Yellow Bus")) {
    const yellowBus = await yellowBusRequest();
    if (yellowBus) {
      const name = yellowBus.name;
      const vehicles = yellowBus.vehicles;

      if (!_.isEmpty(vehicles)) {
        if (name) {
          await bot.sendMessage(msg.chat.id, `<b>Yellow Bus</b>: ${name}`, {
            parse_mode: "HTML",
          });
        }
        await showBusLocation(msg, vehicles);
        await showBusShopDetails(msg, "yellowBus");
      } else {
        const emptyEmoji = String.fromCodePoint(0x274c);
        await bot.sendMessage(
          msg.chat.id,
          `No yellow bus available ${emptyEmoji}`
        );
      }
    }
  } else if (msg.text.toString().includes("Green Bus")) {
    const greenBus = await greenBusRequest();
    if (greenBus) {
      const name = greenBus.name;
      const vehicles = greenBus.vehicles;

      if (!_.isEmpty(vehicles)) {
        if (name) {
          await bot.sendMessage(msg.chat.id, `<b>Green Bus</b>: ${name}`, {
            parse_mode: "HTML",
          });
        }
        await showBusLocation(msg, vehicles);
        await showBusShopDetails(msg, "greenBus");
      } else {
        const emptyEmoji = String.fromCodePoint(0x274c);
        await bot.sendMessage(
          msg.chat.id,
          `No green bus available ${emptyEmoji}`
        );
      }
    }
  } else if (msg.text.toString().includes("Brown Bus")) {
    const brownBus = await brownBusRequest();
    if (brownBus) {
      const name = brownBus.name;
      const vehicles = brownBus.vehicles;

      if (!_.isEmpty(vehicles)) {
        if (name) {
          await bot.sendMessage(msg.chat.id, `<b>Brown Bus</b>: ${name}`, {
            parse_mode: "HTML",
          });
        }
        await showBusLocation(msg, vehicles);
        await showBusShopDetails(msg, "brownBus");
      } else {
        const emptyEmoji = String.fromCodePoint(0x274c);
        await bot.sendMessage(
          msg.chat.id,
          `No brown bus available ${emptyEmoji}`
        );
      }
    }
  } else if (msg.text.toString().includes("Contact Us")) {
    const handEmoji = String.fromCodePoint(0x1f44b);
    const handEmoji2 = String.fromCodePoint(0x1f44d);

    await bot.sendMessage(
      msg.chat.id,
      `Please send email to: yeukfei02@gmail.com or visit github.com/yeukfei02\nWe love your support and suggestions! ${handEmoji} ${handEmoji2}`,
      {
        parse_mode: "HTML",
      }
    );
  }
});

async function showBusLocation(msg, vehicles) {
  await bot.sendMessage(msg.chat.id, `Here are the buses location:`);
  for (let index = 0; index < vehicles.length; index++) {
    const item = vehicles[index];
    await bot.sendLocation(msg.chat.id, item.latitude, item.longitude);
  }
}

async function showBusShopDetails(msg, type) {
  const busStopDetails = await busStopDetailsRequest(type);
  console.log("busStopDetails = ", busStopDetails);

  if (!_.isEmpty(busStopDetails)) {
    const keyboardList = [];
    const busStopEmoji = String.fromCodePoint(0x1f68f);

    for (let index = 0; index < busStopDetails.length; index++) {
      const nameList = [];

      const item = busStopDetails[index];
      const name = item ? item.name : "";

      nameList.push(`${busStopEmoji} ${name}`);
      keyboardList.push(nameList);
    }

    await bot.sendMessage(
      msg.chat.id,
      `Click bus Stop to get bus arrival time`,
      {
        reply_markup: {
          keyboard: keyboardList,
        },
      }
    );

    bot.on("message", async (msg) => {
      await showBusArrivals(msg, busStopDetails);
    });
  }
}

async function showBusArrivals(msg, busStopDetails) {
  if (!_.isEmpty(busStopDetails)) {
    let busStopId = "";
    for (let index = 0; index < busStopDetails.length; index++) {
      const item = busStopDetails[index];

      if (msg.text.toString().includes(item.name)) {
        busStopId = item ? item.busStopId : "";
      }
    }

    if (busStopId) {
      const busArrival = await busArrivalRequest(busStopId);
      console.log("busArrival = ", busArrival);

      if (busArrival) {
        const forecasts = busArrival.forecasts;
        const geometries = busArrival.geometries;

        if (!_.isEmpty(forecasts)) {
          for (let index = 0; index < forecasts.length; index++) {
            const item = forecasts[index];

            const busCount = index + 1;
            const minutes = item ? item.minutes : "";
            await bot.sendMessage(
              msg.chat.id,
              `<b>Next ${busCount} bus is coming in</b>: ${minutes} minutes`,
              {
                parse_mode: "HTML",
              }
            );
          }
        }

        setTimeout(async () => {
          if (!_.isEmpty(geometries)) {
            await bot.sendMessage(msg.chat.id, `Here are the buses location:`);
            for (let index = 0; index < geometries.length; index++) {
              const item = geometries[index];
              await bot.sendLocation(
                msg.chat.id,
                item.latitude,
                item.longitude
              );
            }
          }
        }, 500);
      }
    }
  }
}
