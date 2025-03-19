async function fetchWeather() {
  const cityCode = document.getElementById("city-select").value;
  if (!cityCode) {
    alert("都市を選択してください。");
    return;
  }

  const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityCode}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("データの取得に失敗しました");

    const weatherData = await response.json();

    // 天気情報の取得（weatherData[0]）
    const forecast = weatherData[0];

    // 気温情報の取得（weatherData[1]）
    const tempData = weatherData[1];

    let todayHigh = "情報なし";
    let todayLow = "情報なし";

    // 気温情報の抽出
    if (tempData && tempData.timeSeries) {
      tempData.timeSeries.forEach((series) => {
        if (series.elements) {
          series.elements.forEach((element) => {
            if (element.elementName === "T") {
              // 気温データ
              const temps = element.values;
              if (temps.length >= 2) {
                todayHigh = temps[1] + "℃"; // 今日の最高気温
                todayLow = temps[0] + "℃"; // 今日の最低気温
              }
            }
          });
        }
      });
    }

    displayWeather(forecast, todayHigh, todayLow);
  } catch (error) {
    console.error("エラー:", error);
    alert("天気データの取得に失敗しました。再度お試しください。");
  }
}

// 天気情報を画面に表示する関数
function displayWeather(forecast, highTemp, lowTemp) {
  const timeSeries = forecast.timeSeries;
  if (!timeSeries || timeSeries.length === 0) {
    alert("天気データが取得できませんでした。");
    return;
  }

  const todayWeather = timeSeries[0].areas[0].weathers[0] || "情報なし";
  const tomorrowWeather = timeSeries[0].areas[1]?.weathers[0] || "情報なし";
  const dayAfterTomorrowWeather =
    timeSeries[0].areas[2]?.weathers[0] || "情報なし";

  document.querySelector("#publishingOffice td").textContent =
    forecast.publishingOffice || "情報なし";
  document.querySelector("#reportDatetime td").textContent =
    forecast.reportDatetime || "情報なし";
  document.querySelector("#targetArea td").textContent =
    timeSeries[0].areas[0].area.name || "情報なし";
  document.querySelector("#todayHighTemperature td").textContent = highTemp;
  document.querySelector("#todayLowTemperature td").textContent = lowTemp;
  document.querySelector("#today td").textContent = todayWeather;
  document.querySelector("#tomorrow td").textContent = tomorrowWeather;
  document.querySelector("#dayAfterTomorrow td").textContent =
    dayAfterTomorrowWeather;
}

// イベントリスナーを追加
document.getElementById("get-weather").addEventListener("click", fetchWeather);
