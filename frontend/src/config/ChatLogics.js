export const getSender = (loggedUser, users) => {
  return users[0]._id !== loggedUser._id ? users[0] : users[1];
};

export const getDate = (dateTime) => {
  const monthsArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateObj = new Date(dateTime);
  const date = dateObj.getDate();
  const month = dateObj.getUTCMonth();
  const year = dateObj.getFullYear();
  return `${monthsArr[month]} ${date}, ${year}`;
};

export const getTime = (dateTime) => {
  const localeTimeStr = new Date(dateTime).toLocaleTimeString();

  const localeTimeArr = localeTimeStr.split(" ");

  const timeArr = localeTimeArr[0].split(":").slice(0, 2); // to remove milliseconds

  if (timeArr[0].length === 1) timeArr[0] = "0" + timeArr[0];

  const timeStr =
    timeArr.join(":") + " " + localeTimeArr[localeTimeArr.length - 1];

  return timeStr;
};
