//функция отображения даты завершения задачи в корректном формате
//фозвращает отформатированную дату
export default function EndDate({ endDate }) {
  if (!endDate) {
    return;
  } else {
    const inputDateString = endDate;
    const date = new Date(inputDateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so we add 1
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    return <p>{formattedDate}</p>;
  }
}
