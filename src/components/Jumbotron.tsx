import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import ReactAnimatedWeather from "react-animated-weather";

import { indicateLocalWeather } from "../utils/iconlist";
import fcmProviders from "../firebase/fcm-providers";
import PopupInformation from "./PopupInformation";

interface Country {
  ID: string;
  LocalizedName: string;
}

interface City {
  Key: number;
  LocalizedName: string;
  Country: Country;
}

export const Jumbotron = () => {
  const [searchCity, setSearchCity] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const [popupData, setPopupData] = useState({ keyId: 0, localizedName: "" });

  const accuApiKey = import.meta.env.PUBLIC_ACCUWEATHER_API;
  const [resultData, setResultData] = useState({
    weather: null,
    location: null,
    temperature: null,
    date: "",
  });

  const [searchCityResult, setSearchCityResult] = useState<City[]>([]);

  const findWeather = async (cityKey: number) => {
    return await axios.get(
      `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${accuApiKey}&language=id-id&details=false&metric=true`
    );
  };

  useEffect(() => {
    const fetchWeatherApi = async () => {
      setIsloading(true);
      const cityKey = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=%20${accuApiKey}%20&language=id-id`
      );

      const weatherResult = await findWeather(cityKey.data.Key);
      const locationData = cityKey.data.LocalizedName;

      const dateTimeLocal = weatherResult.data.DailyForecasts[0].Date;
      const dateTimeToStr = format(dateTimeLocal, "EEEE, d MMMM yyyy");

      const weatherTemperature =
        weatherResult.data.DailyForecasts[0].Temperature.Minimum.Value;

      const weatherData = weatherResult.data.DailyForecasts[0].Day;

      console.log("weather data :", weatherData);

      setResultData({
        weather: weatherData.Icon,
        location: locationData,
        temperature: weatherTemperature,
        date: dateTimeToStr,
      });
    };

    fetchWeatherApi();
  }, []);

  useEffect(() => {
    const weatherIcon = indicateLocalWeather.find(
      (simillarIcon) => simillarIcon.iconNumber === resultData.weather
    );

    setWeatherIcon(weatherIcon?.icon!);
  }, [resultData]);


  useEffect(() => {
    const searchCityFn = setTimeout(async () => {
      setIsloading(true);
      axios
        .get(
          `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${accuApiKey}&q=${searchCity}&language=id-id&details=true`
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (data) {
            setSearchCityResult(data);
            setIsloading(false);
          }
        });
    }, 2000);

    return () => clearTimeout(searchCityFn);
  }, [searchCity]);
  
  const dataPassToPopup = (data: { keyId: number; localizedName: string }) => {
    setPopupData({ keyId: data.keyId, localizedName: data.localizedName });
    setSearchCityResult([])
    setSearchCity("")
  };
  
  return (
    <div className="text-center flex justify-center">
      {popupData.localizedName && (
        <div className="z-99 absolute">
          <PopupInformation keyId={popupData.keyId} localizedName={popupData.localizedName} onClose={() => setPopupData({keyId: 0, localizedName: ""})}
          />
        </div>
      )}
      <div className="pt-20">
        <div className="flex justify-center">
          <div className="flex gap-x-3 text-white">
            {weatherIcon && (
              <ReactAnimatedWeather
                icon={weatherIcon}
                color="white"
                size={90}
                animate={true}
              />
            )}
            {resultData && (
              <div className="text-left pt-2">
                <p className="pb-2">{resultData.location}</p>
                <p className="">{resultData.temperature} Celcius</p>
                <p>{resultData.date}</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-white font-semibold text-2xl pt-8">
          Cari Wilayah Untuk Mendapatkan Data Cuaca Dan Gempa
        </p>
        <div className="flex justify-center mt-6">
          <div className="bg-white flex space-x-3 rounded-full p-2 w-3/4">
            <Search size={28} />
            <input
              className="outline-none w-full"
              placeholder="Cari Kota disini..."
              onChange={(event) => {
                event.preventDefault;
                setSearchCity(event.target.value!);
              }}
            ></input>
          </div>
        </div>
        {searchCity && (
          <div className="flex justify-center pt-2">
            <div className="bg-white p-2 rounded-md w-3/4 text-left font-medium">
              {isLoading && <p>Loading...</p>}
              {!isLoading && (
                <ul className="overflow-auto whitespace-normal max-h-[120px]">
                  {searchCityResult && searchCityResult.length !== null ? (
                    searchCityResult
                      .filter((data) => data.Country.ID === "ID")
                      .map((data, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            onClick={() =>
                              dataPassToPopup({
                                keyId: data.Key,
                                localizedName: data.LocalizedName,
                              })
                            }
                          >
                            {data.LocalizedName}
                          </a>
                        </li>
                      ))
                  ) : (
                    <li>No results found</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
