const numberFormatter = new Intl.NumberFormat("PT-br");

const formatNumbers = (number) => numberFormatter.format(number);

const formatDates = (dateParts) => {
  const day = dateParts
    .find((date) => date.type === "day")
    .value.padStart(2, "0");
  const month = dateParts
    .find((date) => date.type === "month")
    .value.padStart(2, "0");
  const year = dateParts
    .find((date) => date.type === "year")
    .value.padStart(2, "0");
  const hour = dateParts
    .find((date) => date.type === "hour")
    .value.padStart(2, "0");
  const minute = dateParts
    .find((date) => date.type === "minute")
    .value.padStart(2, "0");
  return `${day}.${month}.${year.slice(
    year.length - 2,
    year.length
  )} ${hour}.${minute}`;
};

const dateFormatter = new Intl.DateTimeFormat("EN-us", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});