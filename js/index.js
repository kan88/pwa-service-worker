window.addEventListener("load", async () => {
  if (navigator.serviceWorker) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log(reg);
    } catch (error) {}
  }
});

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((err) => (window.location.href = "/offline.html"));
