import axios from "axios";
import { da } from "date-fns/locale";
import { EarthIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import { indicateLocalWeather } from "../../utils/iconlist";

const accuApiKey = import.meta.env.PUBLIC_ACCUWEATHER_API;

interface PopupInformationProps {
  onClose: () => void;
  keyId: number;
  localizedName: string;
}

interface WeatherData {
  Temperature: any;
  WeatherIcon: number;
  WeatherText: string;
}

interface Infogempa {
  gempa: any;
}

interface AllResultAfterFetchState {
  weatherInfo: WeatherData | null;
  earthQuake: Infogempa | null;
}

const PopupInformation: React.FC<PopupInformationProps> = ({
  onClose,
  keyId,
  localizedName,
}) => {
  const [allResultAfterFetch, setAllResultAfterFetch] =
    useState<AllResultAfterFetchState>({
      weatherInfo: null,
      earthQuake: null,
    });

  useEffect(() => {
    axios
      .get(
        `http://dataservice.accuweather.com/currentconditions/v1/${keyId}?apikey=${accuApiKey}`
      )
      .then((response) => {
        const data = response.data[0];
        console.log("data bmkg: ", data);
        setAllResultAfterFetch((prevState) => ({
          ...prevState,
          weatherInfo: data,
        }));
      });

    axios
      .get(`https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json`)
      .then((response) => {
        console.log("data bmkg : ", response);
        const data = response.data.Infogempa;
        setAllResultAfterFetch((prevState) => ({
          ...prevState,
          earthQuake: data,
        }));
      });
  }, []);

  useEffect(() => {
    console.log(allResultAfterFetch);
  }, [allResultAfterFetch]);

  return (
    <div className="bg-white p-4 min-w-[130vh] min-h-[70vh] rounded-md">
      <div className="flex justify-between">
        <p>Informasi Lokasi</p>
        <div onClick={onClose}>
          <X />
        </div>
      </div>
      <hr className="w-90 border-2 mt-2 bg-black" />

      <div className="pt-12">
        <div className="flex justify-center gap-x-40">
          <div className="flex gap-x-3">
            <ReactAnimatedWeather
              icon={
                indicateLocalWeather.find(
                  (data) =>
                    data.iconNumber ===
                    allResultAfterFetch?.weatherInfo?.WeatherIcon
                )?.icon
              }
              size={90}
            />
            <div className="text-left px-2">
              <p className="font-semibold pb-2 text-xl">
                {localizedName}
              </p>
              <p>
                {allResultAfterFetch.weatherInfo?.Temperature?.Metric?.Value}{" "}
                Celcius
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex justify-around gap-x-3">
              <EarthIcon />
              {allResultAfterFetch.earthQuake?.gempa?.find((data: any) => data.Dirasakan === localizedName) ? (<p>Ada gempa</p>) : (<p>Tidak Ada Gempa</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupInformation;
