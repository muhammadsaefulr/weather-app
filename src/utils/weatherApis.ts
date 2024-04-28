import axios from "axios";

const accuApiKey = import.meta.env.PUBLIC_ACCUWEATHER_API;

export async function getCityKeyUsers() {
    try {
        const response = await axios.get(
            `http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${accuApiKey}&language=id-id`
        );

        const data = { Key: response.data.key, LocalizedName: response.data.localizedName}

        return data;
    } catch (error) {
        console.error("Error getting city key:", error);
        throw error
    }
}

export async function getWeatherFromCityKey(cityKey: number){

}