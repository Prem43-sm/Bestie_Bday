const audioFiles = import.meta.glob("../assets/music/*.{mp3,wav,m4a,ogg,aac}", {
  eager: true,
  query: "?url",
  import: "default",
});

const titleOverrides = {
  "birthday-song.mp3": "Birthday Soundtrack",
};

const formatTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const playlist = Object.entries(audioFiles).map(([path, file]) => {
  const fileName = path.split("/").pop();

  return {
    title: titleOverrides[fileName] ?? formatTitle(fileName),
    file,
  };
});
