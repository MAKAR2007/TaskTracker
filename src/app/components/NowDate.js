//компонент отображения даты и времени для заполнения комментария
//Возвращает отформатированную текущую дату и время
export default function NowDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so we add 1
  const year = date.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  console.log(formattedDateTime); // Output: "01.11.2023"
  return formattedDateTime;
}
