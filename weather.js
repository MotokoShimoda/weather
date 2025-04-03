document.getElementById("get-weather").addEventListener("click", fetchWeather);

async function fetchWeather() {
  const cityCode = "130000";
  const apiUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityCode}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("天気データの取得に失敗しました。");

    const data = await response.json();
    console.log("取得したデータ:", data);

    let forecastData, temperatureData;
    if (Array.isArray(data)) {
      // [0] が天気、[1] が気温情報
      if (data.length >= 2) {
        forecastData = data[0];
        temperatureData = data[1];
      } else {
        forecastData = data[0];
        temperatureData = data[0];
      }
    } else {
      // 単一オブジェクトの場合
      forecastData = data;
      temperatureData = data;
    }

    displayWeather(forecastData, temperatureData);
  } catch (error) {
    console.error(error);
    alert("天気データの取得に失敗しました。再度お試しください。");
  }
}

function displayWeather(forecastData, temperatureData) {
  if (
    !forecastData ||
    !forecastData.timeSeries ||
    forecastData.timeSeries.length === 0
  ) {
    alert("天気データが正しく取得できませんでした。");
    return;
  }

  const weatherSeries = forecastData.timeSeries.find(
    (ts) =>
      ts.areas && ts.areas.length > 0 && ts.areas[0].weathers !== undefined
  );
  if (!weatherSeries) {
    alert("天気予報のデータが正しく取得できませんでした。");
    return;
  }
  const areaWeather = weatherSeries.areas[0];

  let areaTemp = null;
  if (temperatureData && temperatureData.timeSeries) {
    areaTemp =
      temperatureData.timeSeries.find(
        (ts) =>
          ts.areas &&
          ts.areas.length > 0 &&
          (ts.areas[0].tempsMin !== undefined ||
            ts.areas[0].tempsMax !== undefined)
      )?.areas[0] || null;
  }

  // 発表情報の表示
  document.querySelector("#publishingOffice td").textContent =
    forecastData.publishingOffice || "情報なし";
  document.querySelector("#reportDatetime td").textContent =
    forecastData.reportDatetime || "情報なし";
  document.querySelector("#targetArea td").textContent =
    (areaWeather.area && areaWeather.area.name) || "情報なし";

  // 天気予報
  document.querySelector("#today td").textContent =
    (areaWeather.weathers && areaWeather.weathers[0]) || "情報なし";
  document.querySelector("#tomorrow td").textContent =
    (areaWeather.weathers && areaWeather.weathers[1]) || "情報なし";
  document.querySelector("#dayAfterTomorrow td").textContent =
    (areaWeather.weathers && areaWeather.weathers[2]) || "情報なし";

  // 気温情報
  if (areaTemp) {
    const highTemps = areaTemp.tempsMax || [];
    const lowTemps = areaTemp.tempsMin || [];
    const todayHigh =
      highTemps.length > 0 && highTemps[0] && highTemps[0] !== "--"
        ? `${highTemps[0]}℃`
        : "情報なし";
    const todayLow =
      lowTemps.length > 0 && lowTemps[0] && lowTemps[0] !== "--"
        ? `${lowTemps[0]}℃`
        : "情報なし";
    document.querySelector("#todayHighTemperature td").textContent = todayHigh;
    document.querySelector("#todayLowTemperature td").textContent = todayLow;
  } else {
    document.querySelector("#todayHighTemperature td").textContent = "情報なし";
    document.querySelector("#todayLowTemperature td").textContent = "情報なし";
  }
}
