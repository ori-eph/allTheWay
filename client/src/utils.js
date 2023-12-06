export const handleServerRequest = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw Error("A loading error has accrued, please try again later.");
    }
    const data = await response.json();
    return data;
  };