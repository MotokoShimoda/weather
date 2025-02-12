document.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city-select");
  const getWeatherButton = document.getElementById("get-weather");

  // 天気データを表示
  const displayWeather = (weather) => {
    const publishingOfficeCell = document.querySelector("#publishingOffice td");
    const reportDatetimeCell = document.querySelector("#reportDatetime td");
    const targetAreaCell = document.querySelector("#targetArea td");
    const todayHighTemperatureCell = document.querySelector(
      "#todayHighTemperature td"
    );
    const todayLowTemperatureCell = document.querySelector(
      "#todayLowTemperature td"
    );
    const todayCell = document.querySelector("#today td");
    const tomorrowCell = document.querySelector("#tomorrow td");
    const dayAfterTomorrowCell = document.querySelector("#dayAfterTomorrow td");

    //[0] に天気、[1] に温度情報
    const areaInfo = weather.timeSeries[0].areas[0];
    const temperatureInfo = weather.timeSeries[1]?.areas[0];

    publishingOfficeCell.textContent = weather.publishingOffice;
    reportDatetimeCell.textContent = new Date(
      weather.reportDatetime
    ).toLocaleString();
    targetAreaCell.textContent = areaInfo.area.name;

    todayCell.textContent = areaInfo.weathers[0] || "情報なし";
    tomorrowCell.textContent = areaInfo.weathers[1] || "情報なし";
    dayAfterTomorrowCell.textContent = areaInfo.weathers[2] || "情報なし";

    //[1] を最高気温、[0] を最低気温
    todayHighTemperatureCell.textContent = temperatureInfo?.temps[1]
      ? temperatureInfo.temps[1] + "℃"
      : "情報なし";
    todayLowTemperatureCell.textContent = temperatureInfo?.temps[0]
      ? temperatureInfo.temps[0] + "℃"
      : "情報なし";
  };

  const fetchWeather = async (cityCode) => {
    const apiUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityCode}.json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
      const weatherData = await response.json();
      displayWeather(weatherData[0]);
    } catch (error) {
      alert("天気データの取得に失敗しました。再度お試しください。");
      console.error(error);
    }
  };

  // ボタンのクリックイベント
  getWeatherButton.addEventListener("click", () => {
    const cityCode = citySelect.value;
    if (!cityCode) {
      alert("都市を選択してください。");
      return;
    }
    fetchWeather(cityCode);
  });
});
