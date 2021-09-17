export function kitsuURL(path: string) {
  return `${process.env.REACT_APP_KITSU_URL}/${path}`;
}

export function kitsuAPIURL(path: string) {
  return kitsuURL(`api/${path}`);
}

export function pictureThumbnailURL(category: "persons", id: string) {
  return kitsuAPIURL(`pictures/thumbnails/${category}/${id}.png`);
}
