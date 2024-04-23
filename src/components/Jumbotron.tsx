import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import ReactAnimatedWeather from "react-animated-weather";

import { indicateLocalWeather } from "../etc/iconlist";
import { isLoading } from "../store/nanostore";

interface City {
  Key: number;
  LocalizedName: string;
}

export const Jumbotron = () => {
  const [exampleData, setExampleData] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isLoading, setIsloading] = useState(false);

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
      const objectWeatherApi = weatherResult.data;

      const weatherData = weatherResult.data.DailyForecasts[0].Day;

      setResultData({
        weather: weatherData.Icon,
        location: locationData,
        temperature: weatherTemperature,
        date: dateTimeToStr,
      });
      setExampleData(objectWeatherApi);
    };

    fetchWeatherApi();
  }, []);

  useEffect(() => {
    const weatherIcon = indicateLocalWeather.find(
      (simillarIcon) => simillarIcon.iconNumber === resultData.weather
    );

    console.log("weather icon Number: ", weatherIcon);

    setWeatherIcon(weatherIcon?.icon!);
  }, [resultData]);

  useEffect(() => {
    const searchCityFn = setTimeout(() => {
      setIsloading(true);
      axios
        .get(
          `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${accuApiKey}&q=${searchCity}&language=id-id`
        )
        .then((response: any) => {
          setSearchCityResult(response.data);
          setIsloading(false); // Move this inside the then block to ensure loading state is set properly
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setSearchCityResult([]); // Handle error case by setting search result to empty array
          setIsloading(false); // Ensure loading state is set to false even in case of error
        });
    }, 2000);

    return () => clearTimeout(searchCityFn);
  }, [searchCity]);

  return (
    <div className="text-center flex justify-center">
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
          Cari Wilayah Untuk Mendapatkan Info Cuaca
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
        <div className="flex justify-center pt-2">
          <div className="bg-white p-2 rounded-md w-3/4">
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
              <ul className="text-left overflow-auto whitespace-normal max-h-[120px]">
                {searchCityResult && searchCityResult.length > 0 ? (
                  searchCityResult.map((data, index) => (
                    <li key={index}>
                      <a href="#">{data.LocalizedName}</a>
                    </li>
                  ))
                ) : (
                  <li>No results found</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
