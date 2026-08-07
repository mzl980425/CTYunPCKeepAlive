const { fetch, setTimeout, setInterval, clearTimeout, clearInterval } = (() => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const fetch = iframe.contentWindow!.fetch;
  const setTimeout = iframe.contentWindow!.setTimeout;
  const setInterval = iframe.contentWindow!.setInterval;
  const clearTimeout = iframe.contentWindow!.clearTimeout;
  const clearInterval = iframe.contentWindow!.clearInterval;

  return { fetch, setTimeout, setInterval, clearTimeout, clearInterval };
})();

export { fetch, setTimeout, setInterval, clearTimeout, clearInterval };

export default {
  fetch,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
};
