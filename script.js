const form = document.getElementById("driverForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = form.name.value.trim();

  message.textContent =
    `Bedankt ${name}! Je aanvraag is ontvangen. We nemen zo snel mogelijk contact met je op.`;

  form.reset();
});
