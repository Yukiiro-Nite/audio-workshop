const container = document.getElementById('app');

navigator.mediaDevices.enumerateDevices()
  .then(createMediaSelectors);

function createMediaSelectors(devices) {
  const audioInputs = devices.filter(device => device.kind === 'audioinput');
  const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

  const audioInputContainer = el({});
  const audioOutputContainer = el({});

}

function el({tag='div', attrs={}, props={}, events={}, children=[]}) {
  const element = document.createElement(tag);

  setEvents(element, events);
  setProps(element, props);
  setAttributes(element, attrs);

  children.map(el).forEach(child => element.append(child));

  return element
}

const setAttributes = (el, attrs={}) => Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
const setProps = (el, props={}) => Object.entries(props).forEach(([key, value]) => el[key] = value);
const setEvents = (el, events={}) => Object.entries(events).forEach(([key, value]) => el.addEventListener(key, value));