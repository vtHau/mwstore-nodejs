import Tesseract from "tesseract.js";

const OcrService = {
  tesseract: async (image) => {
    let res;

    await Tesseract.recognize(image, "vie", {
      logger: (m) => console.log("Ocr log", m),
    }).then(({ data: { text } }) => {
      res = text;
    });

    return res;
  },
};

export default OcrService;
