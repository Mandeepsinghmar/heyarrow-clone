const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `<a style="color: rgb(48, 132, 245)" href="${url}" target="blank">${url}</a>`);
};

export default urlify;
