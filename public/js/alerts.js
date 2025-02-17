export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  // Create a DOM element from the markup string
  const alertElement = document.createElement('div');
  alertElement.innerHTML = markup;

  // Insert the element into the body
  document.querySelector('body').insertAdjacentElement('afterbegin', alertElement.firstChild);

  // Hide the alert after 5 seconds
  window.setTimeout(hideAlert, 5000);
};
