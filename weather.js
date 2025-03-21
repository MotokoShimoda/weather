document.getElementById("get-weather").addEventListener("click", fetchWeather);

async function fetchWeather() {
  const cityCode = document.getElementById("city-select").value;
  if (!cityCode) {
    alert("都市を選択してください。");
    return;
  }

  const apiUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityCode}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("天気データの取得に失敗しました。");

    const weatherData = await response.json();
    console.log("取得したデータ:", weatherData); // デバッグ用

    displayWeather(weatherData);
  } catch (error) {
    console.error(error);
    alert("天気データの取得に失敗しました。再度お試しください。");
  }
}

function displayWeather(weatherData) {
  if (!weatherData || weatherData.length < 2) {
    alert("天気データが正しく取得できませんでした。");
    return;
  }

  // **天気情報の取得**
  const weatherInfo = weatherData[0];
  const timeSeriesWeather = weatherInfo.timeSeries.find(
    (ts) => ts.areas.length > 0
  );
  const areaWeather = timeSeriesWeather.areas[0]; // 最初のエリア情報を取得

  // **気温情報の取得**
  const temperatureInfo = weatherData[1];
  const timeSeriesTemp = temperatureInfo.timeSeries.find(
    (ts) => ts.areas.length > 0
  );
  const areaTemp = timeSeriesTemp.areas[0]; // 最初のエリア情報を取得

  // データが取得できているか確認
  if (!areaWeather || !areaTemp) {
    alert("指定された都市のデータが見つかりません。");
    return;
  }

  // **天気情報の反映**
  document.querySelector("#publishingOffice td").textContent =
    weatherInfo.publishingOffice || "情報なし";
  document.querySelector("#reportDatetime td").textContent =
    weatherInfo.reportDatetime || "情報なし";
  document.querySelector("#targetArea td").textContent =
    areaWeather.area.name || "情報なし";

  document.querySelector("#today td").textContent =
    areaWeather.weathers[0] || "情報なし";
  document.querySelector("#tomorrow td").textContent =
    areaWeather.weathers[1] || "情報なし";
  document.querySelector("#dayAfterTomorrow td").textContent =
    areaWeather.weathers[2] || "情報なし";

  // **気温情報の反映**
  const highTemps = areaTemp.tempsMax || [];
  const lowTemps = areaTemp.tempsMin || [];

  document.querySelector("#todayHighTemperature td").textContent =
    highTemps.length > 0 && highTemps[0] !== null
      ? `${highTemps[0]}℃`
      : "情報なし";
  document.querySelector("#todayLowTemperature td").textContent =
    lowTemps.length > 0 && lowTemps[0] !== null
      ? `${lowTemps[0]}℃`
      : "情報なし";
}
